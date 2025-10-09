import { createThirdwebClient, ThirdwebClient } from 'thirdweb';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Thirdweb configuration
const THIRDWEB_CLIENT_ID = '13c65c9847366b6e9b0d302cd4e3acee';

// Create Thirdweb client with domain configuration
export const thirdwebClient: ThirdwebClient = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
  // Add domain configuration for live deployment
  ...(typeof window !== 'undefined' && window.location.hostname.includes('minimax.io') && {
    domains: [window.location.hostname]
  })
});

// Wallet configurations
export const wallets = [
  inAppWallet({
    auth: {
      options: [
        'google',
        'discord', 
        'telegram',
        'github',
        'facebook',
        'apple',
        'email',
        'phone',
        'passkey'
      ]
    }
  }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('com.binance.wallet'),
  createWallet('io.rabby'),
  createWallet('com.okex.wallet')
];

// Thirdweb user interface
export interface ThirdwebUser {
  address: string;
  email?: string;
  name?: string;
  profileImage?: string;
  connected: boolean;
  wallet?: any;
}

// Thirdweb authentication hook
export function useThirdwebAuth() {
  const [user, setUser] = useState<ThirdwebUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeWallet, setActiveWallet] = useState<any>(null);

  // Check for persisted connection on mount
  useEffect(() => {
    checkPersistedConnection();
  }, []);

  // Check for persisted wallet connection
  const checkPersistedConnection = async () => {
    try {
      const savedWalletData = localStorage.getItem('thirdweb_wallet_data');
      if (savedWalletData) {
        const walletInfo = JSON.parse(savedWalletData);
        setUser(walletInfo);
        console.log('Restored Thirdweb wallet connection:', walletInfo.address);
      }
    } catch (error) {
      console.error('Failed to restore wallet connection:', error);
      localStorage.removeItem('thirdweb_wallet_data');
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use in-app wallet for social logins
      const wallet = wallets[0];
      
      // Connect to wallet with retry logic for live deployment
      let account;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!account && retryCount < maxRetries) {
        try {
          account = await wallet.connect({
            client: thirdwebClient
          });
          break;
        } catch (connectError: any) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw connectError;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!account) {
        throw new Error('Failed to connect wallet after multiple attempts');
      }

      // Get account details
      let address: string;
      try {
        address = account.address || await account.getAddress();
      } catch (addressError) {
        console.warn('Could not get address:', addressError);
        address = 'unknown';
      }

      // Create user object
      const thirdwebUser: ThirdwebUser = {
        address,
        email: (account as any).email,
        name: (account as any).name || `User ${address.slice(0, 8)}`,
        profileImage: (account as any).profileImage,
        connected: true,
        wallet: account
      };

      setUser(thirdwebUser);
      setActiveWallet(wallet);

      // Persist connection
      localStorage.setItem('thirdweb_wallet_data', JSON.stringify({
        address: thirdwebUser.address,
        email: thirdwebUser.email,
        name: thirdwebUser.name,
        profileImage: thirdwebUser.profileImage,
        connected: true
      }));

      // Create/update Supabase profile for Thirdweb user
      await createThirdwebProfile(thirdwebUser);

      console.log('Thirdweb wallet connected successfully:', thirdwebUser);
      return thirdwebUser;

    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      if (activeWallet?.disconnect) {
        await activeWallet.disconnect();
      }
      
      setUser(null);
      setActiveWallet(null);
      setError(null);
      
      // Clear persisted data
      localStorage.removeItem('thirdweb_wallet_data');
      
      console.log('Thirdweb wallet disconnected');
    } catch (error: any) {
      console.error('Wallet disconnection failed:', error);
      // Force clear state even if disconnect fails
      setUser(null);
      setActiveWallet(null);
      localStorage.removeItem('thirdweb_wallet_data');
    }
  };

  // Create or update Thirdweb user profile in Supabase
  const createThirdwebProfile = async (thirdwebUser: ThirdwebUser) => {
    try {
      const profileId = `thirdweb_${thirdwebUser.address.toLowerCase()}`;
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', profileId)
        .maybeSingle();

      const profileData = {
        user_id: profileId,
        email: thirdwebUser.email || null,
        full_name: thirdwebUser.name || 'Thirdweb User',
        username: thirdwebUser.name?.toLowerCase().replace(/\s+/g, '_') || `user_${thirdwebUser.address.slice(0, 8)}`,
        avatar_url: thirdwebUser.profileImage || null,
        bio: 'Connected via Thirdweb wallet',
        social_links: {
          wallet_address: thirdwebUser.address,
          provider: 'thirdweb',
          connected_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', profileId);
          
        if (error) {
          console.error('Failed to update Thirdweb profile:', error);
        }
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            ...profileData,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Failed to create Thirdweb profile:', error);
        }
      }

      console.log('Thirdweb profile synced with database');
    } catch (error) {
      console.error('Failed to sync Thirdweb profile:', error);
      // Don't throw error to prevent wallet connection failure
    }
  };

  return {
    user,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isConnected: !!user?.connected
  };
}

// Export client for direct usage
export default thirdwebClient;
