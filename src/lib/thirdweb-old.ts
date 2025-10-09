// Thirdweb configuration for international users with real SDK integration
import { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

// Thirdweb client configuration
export const thirdwebClient = createThirdwebClient({
  clientId: "13c65c9847366b6e9b0d302cd4e3acee", // Provided Thirdweb ID
});

// Real Thirdweb wallet configuration for international users
export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google", "discord", "telegram", "github", 
        "facebook", "apple", "email", "phone", "passkey"
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("io.rabby"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.binance.wallet"),
  createWallet("com.okex.wallet"),
];

// Thirdweb authentication hook with real SDK integration
export interface ThirdwebUser {
  address: string;
  email?: string;
  name?: string;
  profileImage?: string;
}

export function useThirdwebAuth() {
  const [user, setUser] = useState<ThirdwebUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWallet, setActiveWallet] = useState<any>(null);

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Use the in-app wallet for social login
      const wallet = wallets[0];
      const account = await wallet.connect({
        client: thirdwebClient,
      });
      
      if (account) {
        let address: string;
        try {
          address = account.address || await account.getAddress();
        } catch (addressError) {
          console.warn('Failed to get address from account:', addressError);
          address = 'unknown';
        }
        
        const userInfo: ThirdwebUser = {
          address,
          email: (account as any).email || undefined,
          name: (account as any).name || 'Thirdweb User',
          profileImage: (account as any).profileImage || undefined
        };
        
        setUser(userInfo);
        setActiveWallet(wallet);
        
        // Store in localStorage for persistence
        localStorage.setItem('thirdweb_user', JSON.stringify(userInfo));
        localStorage.setItem('thirdweb_wallet', 'connected');
        
        console.log('Thirdweb user connected:', userInfo);
        
        return userInfo;
      }
    } catch (error) {
      console.error('Thirdweb authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (activeWallet?.disconnect) {
        await activeWallet.disconnect();
      }
      setUser(null);
      setActiveWallet(null);
      
      // Clear localStorage
      localStorage.removeItem('thirdweb_user');
      localStorage.removeItem('thirdweb_wallet');
    } catch (error) {
      console.error('Thirdweb logout failed:', error);
      // Clear state even if disconnect fails
      setUser(null);
      setActiveWallet(null);
      localStorage.removeItem('thirdweb_user');
      localStorage.removeItem('thirdweb_wallet');
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if there's an existing active wallet connection
        const savedUser = localStorage.getItem('thirdweb_user');
        const savedWallet = localStorage.getItem('thirdweb_wallet');
        
        if (savedUser && savedWallet) {
          try {
            const userInfo = JSON.parse(savedUser);
            setUser(userInfo);
            console.log('Restored Thirdweb user from localStorage:', userInfo);
          } catch (parseError) {
            console.warn('Failed to parse saved Thirdweb user:', parseError);
            localStorage.removeItem('thirdweb_user');
            localStorage.removeItem('thirdweb_wallet');
          }
        }
      } catch (error) {
        console.log('No existing Thirdweb connection');
      }
    };
    
    checkConnection();
  }, []);

  return {
    user,
    isLoading,
    login,
    logout
  };
}
