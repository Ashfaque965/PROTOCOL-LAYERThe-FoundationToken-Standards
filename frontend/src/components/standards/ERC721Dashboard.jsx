import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './StandardsCommon.css';

export default function ERC721Dashboard() {
  const { account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractAddress: '',
    tokenURI: '',
    toAddress: '',
    tokenId: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMint = async () => {
    if (!formData.contractAddress || !formData.tokenURI) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      // Mock implementation - replace with actual contract interaction
      console.log('Minting ERC-721 token:', formData);
      setResult({
        type: 'success',
        message: 'Token minted successfully!',
        txHash: '0x...'
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!formData.toAddress || !formData.tokenId) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      console.log('Transferring ERC-721 token:', formData);
      setResult({
        type: 'success',
        message: 'Token transferred successfully!',
        txHash: '0x...'
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="dashboard empty-state">
        <div className="empty-state-content">
          <h2>🚫 Wallet Not Connected</h2>
          <p>Please connect your wallet to interact with ERC-721 tokens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>ERC-721: Individual NFTs</h1>
        <p className="subtitle">Best for: Art, Certificates, Collectibles</p>
      </div>

      <div className="grid grid-2">
        {/* Mint Card */}
        <div className="card">
          <div className="card-header">
            <h3>Mint NFT</h3>
          </div>
          <form className="form">
            <div className="form-group">
              <label className="form-label">Contract Address</label>
              <input
                type="text"
                className="form-input"
                name="contractAddress"
                value={formData.contractAddress}
                onChange={handleInputChange}
                placeholder="0x..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Token URI (Metadata)</label>
              <input
                type="text"
                className="form-input"
                name="tokenURI"
                value={formData.tokenURI}
                onChange={handleInputChange}
                placeholder="ipfs://... or http://..."
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleMint}
              disabled={loading}
            >
              {loading ? '⏳ Minting...' : '✨ Mint NFT'}
            </button>
          </form>
        </div>

        {/* Transfer Card */}
        <div className="card">
          <div className="card-header">
            <h3>Transfer NFT</h3>
          </div>
          <form className="form">
            <div className="form-group">
              <label className="form-label">Token ID</label>
              <input
                type="text"
                className="form-input"
                name="tokenId"
                value={formData.tokenId}
                onChange={handleInputChange}
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Address</label>
              <input
                type="text"
                className="form-input"
                name="toAddress"
                value={formData.toAddress}
                onChange={handleInputChange}
                placeholder="0x..."
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleTransfer}
              disabled={loading}
            >
              {loading ? '⏳ Transferring...' : '📤 Transfer'}
            </button>
          </form>
        </div>
      </div>

      {/* Info Card */}
      <div className="card">
        <div className="card-header">
          <h3>📊 ERC-721 Characteristics</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <strong>Token Standard:</strong>
            <span>One unique token per NFT</span>
          </div>
          <div className="info-item">
            <strong>Use Cases:</strong>
            <span>Art, Collectibles, Certificates, Gaming Assets</span>
          </div>
          <div className="info-item">
            <strong>Gas Efficiency:</strong>
            <span>Moderate (Good for less frequent transactions)</span>
          </div>
          <div className="info-item">
            <strong>Metadata Storage:</strong>
            <span>Off-chain (IPFS, databases)</span>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`card alert alert-${result.type}`}>
          <strong>{result.type === 'success' ? '✓' : '✕'} {result.message}</strong>
          {result.txHash && <p className="tx-hash">{result.txHash}</p>}
        </div>
      )}
    </div>
  );
}
