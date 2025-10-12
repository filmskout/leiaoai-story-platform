import React, { useState } from 'react';
import { Wallet, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Wallet type
type WalletType = 'ethereum' | 'solana';

interface WalletConnectProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onSuccess, onError }) => {
  const { signInWithWallet } = useAuth();
  const [connecting, setConnecting] = useState<WalletType | null>(null);
  const [connected, setConnected] = useState<string | null>(null);

  // Connect to Ethereum wallet (MetaMask, etc.)
  const connectEthereum = async () => {
    try {
      setConnecting('ethereum');

      // Check if MetaMask is installed
      if (!(window as any).ethereum) {
        toast.error('Please install MetaMask to use Ethereum wallet');
        return;
      }

      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = accounts[0];

      // Create message to sign
      const message = `Sign in to LeiaoAI with ethereum wallet: ${walletAddress}`;
      
      // Request signature
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      });

      // Sign in with wallet
      const { error } = await signInWithWallet(walletAddress, 'ethereum', signature);

      if (error) {
        throw error;
      }

      setConnected(walletAddress);
      onSuccess?.();
    } catch (error: any) {
      console.error('Ethereum wallet connection failed:', error);
      const errorMessage = error.message || 'Failed to connect Ethereum wallet';
      toast.error(errorMessage);
      onError?.(error);
    } finally {
      setConnecting(null);
    }
  };

  // Connect to Solana wallet (Phantom, etc.)
  const connectSolana = async () => {
    try {
      setConnecting('solana');

      // Check if Phantom is installed
      const solana = (window as any).solana;
      if (!solana || !solana.isPhantom) {
        toast.error('Please install Phantom wallet to use Solana');
        window.open('https://phantom.app/', '_blank');
        return;
      }

      // Connect to wallet
      const response = await solana.connect();
      const walletAddress = response.publicKey.toString();

      // Create message to sign
      const message = `Sign in to LeiaoAI with solana wallet: ${walletAddress}`;
      const encodedMessage = new TextEncoder().encode(message);

      // Request signature
      const signedMessage = await solana.signMessage(encodedMessage, 'utf8');
      const signature = Buffer.from(signedMessage.signature).toString('hex');

      // Sign in with wallet
      const { error } = await signInWithWallet(walletAddress, 'solana', signature);

      if (error) {
        throw error;
      }

      setConnected(walletAddress);
      onSuccess?.();
    } catch (error: any) {
      console.error('Solana wallet connection failed:', error);
      const errorMessage = error.message || 'Failed to connect Solana wallet';
      toast.error(errorMessage);
      onError?.(error);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Ethereum/MetaMask Button */}
      <Button
        onClick={connectEthereum}
        disabled={!!connecting}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        {connecting === 'ethereum' ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Connecting...</span>
          </>
        ) : connected && connecting === null ? (
          <>
            <Check size={20} />
            <span>Connected to Ethereum</span>
          </>
        ) : (
          <>
            <Wallet size={20} />
            <span>Connect Ethereum Wallet</span>
          </>
        )}
      </Button>

      {/* Solana/Phantom Button */}
      <Button
        onClick={connectSolana}
        disabled={!!connecting}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white"
      >
        {connecting === 'solana' ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Connecting...</span>
          </>
        ) : connected && connecting === null ? (
          <>
            <Check size={20} />
            <span>Connected to Solana</span>
          </>
        ) : (
          <>
            <Wallet size={20} />
            <span>Connect Solana Wallet</span>
          </>
        )}
      </Button>

      {/* Help text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        Connect your Web3 wallet to sign in securely without a password
      </p>
    </div>
  );
};

export default WalletConnect;

