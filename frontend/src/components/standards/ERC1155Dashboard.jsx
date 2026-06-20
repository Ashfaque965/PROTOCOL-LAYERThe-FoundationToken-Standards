import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './StandardsCommon.css';

export default function ERC1155Dashboard() {
  const { account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractAddress: '',
    tokenId: '',
    amount: '',
    toAddress: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBatchMint = async () => {
    if (!formData.contractAddress || !formData.tokenId || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      console.log('Batch minting ERC-1155 tokens:', formData);
      setResult({
        type: 'success',
        message: 'Tokens minted successfully!',
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

  const handleBatchTransfer = async () => {
    if (!formData.toAddress || !formData.tokenId || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      console.log('Batch transferring ERC-1155 tokens:', formData);
      setResult({
        type: 'success',
        message: 'Tokens transferred successfully!',
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
          <p>Please connect your wallet to interact with ERC-1155 tokens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>ERC-1155: Multi-Token Standard</h1>
        <p className="subtitle">Supports both fungible & non-fungible tokens. Gas efficient!</p>
      </div>

      <div className="grid grid-2">
        {/* Batch Mint Card */}
        <div className="card">
          <div className="card-header">
            <h3>Batch Mint Tokens</h3>
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
              <label className="form-label">Token ID</label>
              <input
                type="number"
                className="form-input"
                name="tokenId"
                value={formData.tokenId}
                onChange={handleInputChange}
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-input"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="100"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleBatchMint}
              disabled={loading}
            >
              {loading ? '⏳ Minting...' : '✨ Batch Mint'}
            </button>
          </form>
        </div>

        {/* Batch Transfer Card */}
        <div className="card">
          <div className="card-header">
            <h3>Batch Transfer</h3>
          </div>
          <form className="form">
            <div className="form-group">
              <label className="form-label">Token ID</label>
              <input
                type="number"
                className="form-input"
                name="tokenId"
                value={formData.tokenId}
                onChange={handleInputChange}
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount to Transfer</label>
              <input
                type="number"
                className="form-input"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="50"
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
              onClick={handleBatchTransfer}
              disabled={loading}
            >
              {loading ? '⏳ Transferring...' : '📤 Batch Transfer'}
            </button>
          </form>
        </div>
      </div>

      {/* Info Card */}
      <div className="card">
        <div className="card-header">
          <h3>📊 ERC-1155 Characteristics</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <strong>Token Type:</strong>
            <span>Hybrid (Fungible + Non-Fungible)</span>
          </div>
          <div className="info-item">
            <strong>Best For:</strong>
            <span>Gaming, Metaverse, Item Systems</span>
          </div>
          <div className="info-item">
            <strong>Key Advantage:</strong>
            <span>🔥 Much lower gas costs (batch operations)</span>
          </div>
          <div className="info-item">
            <strong>Batch Operations:</strong>
            <span>Mint/Transfer multiple tokens in one transaction</span>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <div className="card-header">
          <h3>✨ Key Benefits</h3>
        </div>
        <div className="benefits-list">
          <div className="benefit">
            <span className="benefit-icon">⚡</span>
            <div>
              <strong>Gas Efficient</strong>
              <p>Significantly lower gas costs than multiple ERC-721 transactions</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🎮</span>
            <div>
              <strong>Gaming Multiple Items</strong>
              <p>Mint weapons, armor, and potions in one transaction</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🔄</span>
            <div>
              <strong>Flexible Token Types</strong>
              <p>Same contract can handle both fungible and non-fungible tokens</p>
            </div>
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
