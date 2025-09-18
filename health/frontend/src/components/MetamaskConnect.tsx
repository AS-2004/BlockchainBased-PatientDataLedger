import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

interface MetamaskConnectProps {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  onSignMessage?: (signature: string, address: string) => void;
  showSignButton?: boolean;
}

export const MetamaskConnect: React.FC<MetamaskConnectProps> = ({
  walletAddress,
  setWalletAddress,
  onSignMessage,
  showSignButton = false
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const signMessage = async () => {
    if (!walletAddress || !onSignMessage) return;

    setIsSigning(true);
    setError(null);

    try {
      const message = `Sign this message to authenticate with MedChain: ${Date.now()}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      });

      onSignMessage(signature, walletAddress);
    } catch (err: any) {
      setError(err.message || 'Failed to sign message');
    } finally {
      setIsSigning(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setError(null);
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress(null);
        } else {
          setWalletAddress(accounts[0]);
        }
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, [setWalletAddress]);

  if (walletAddress) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm font-medium text-primary-800">Wallet Connected</p>
              <p className="text-xs text-primary-600 font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="text-primary-700 border-primary-300 hover:bg-primary-100"
          >
            Disconnect
          </Button>
        </div>

        {showSignButton && onSignMessage && (
          <Button
            onClick={signMessage}
            disabled={isSigning}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            {isSigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing Message...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Sign Message to Authenticate
              </>
            )}
          </Button>
        )}

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full bg-primary-600 hover:bg-primary-700"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            Connect MetaMask Wallet
          </>
        )}
      </Button>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Connect your MetaMask wallet to securely access your medical records
      </p>
    </div>
  );
};