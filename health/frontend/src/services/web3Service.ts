class Web3Service {
  private walletAddress: string | null = null;

  async connectWallet(): Promise<string | null> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        this.walletAddress = accounts[0];
        return this.walletAddress;
      }
      return null;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  disconnectWallet(): void {
    this.walletAddress = null;
  }

  getAddress(): string | null {
    return this.walletAddress;
  }

  isConnected(): boolean {
    return this.walletAddress !== null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, this.walletAddress],
      });
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }
}

const web3Service = new Web3Service();
export default web3Service;