import React from 'react';
import { useWallet } from '../hooks/useWallet';
import './WalletButton.css';

export default function WalletButton() {
  const { account, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (account) {
    return (
      <div className="wallet-connected">
        <span className="account-address">{formatAddress(account)}</span>
        <button className="btn btn-secondary" onClick={disconnectWallet}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary"
      onClick={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <span className="loading"></span>
          Connecting...
        </>
      ) : (
        '🦊 Connect Wallet'
      )}
    </button>
  );
}
