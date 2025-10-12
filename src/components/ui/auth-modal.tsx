import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Chrome, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthModal({ isOpen, onClose, title, description }: AuthModalProps) {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleSignIn = () => {
    onClose();
    navigate('/auth');
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error: any) {
      console.error('Google sign in failed:', error);
      toast.error('Google sign in failed');
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

        <div className="space-y-3">
          {/* Email/Password Sign In */}
          <Button
            onClick={handleSignIn}
            className="w-full flex items-center gap-2"
            variant="default"
          >
            <User className="h-4 w-4" />
            Sign In with Email
          </Button>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            variant="outline"
          >
            <Chrome className="h-4 w-4 text-blue-500" />
            Continue with Google
          </Button>

          {/* Web3 Wallet */}
          <Button
            onClick={handleSignIn}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>

          <p className="text-xs text-center text-gray-500 mt-2">
            Choose your preferred sign in method
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
