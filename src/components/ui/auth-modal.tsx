import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThirdwebAuth } from '@/lib/thirdweb';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthModal({ isOpen, onClose, title, description }: AuthModalProps) {
  const navigate = useNavigate();
  const { connectWallet, isLoading: isConnecting } = useThirdwebAuth();

  const handleSignIn = () => {
    onClose();
    navigate('/auth');
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      onClose();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {title || 'Sign In Required'}
          </DialogTitle>
          <DialogDescription>
            {description || 'Please sign in to continue with this action.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={handleSignIn}
            className="w-full flex items-center gap-2"
            variant="default"
          >
            <User className="h-4 w-4" />
            Sign In with Email
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
