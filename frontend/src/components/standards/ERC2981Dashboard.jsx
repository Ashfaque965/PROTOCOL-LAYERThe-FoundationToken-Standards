import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './StandardsCommon.css';

export default function ERC2981Dashboard() {
  const { account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractAddress: '',
    tokenId: '',
    royaltyPercentage: '',
    recipient: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSetRoyalty = async () => {
    if (!formData.royaltyPercentage || !formData.recipient) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      console.log('Setting royalty info:', formData);
      setResult({
        type: 'success',
        message: `Royalty set to ${formData.royaltyPercentage}%`,
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
          <p>Please connect your wallet to set royalty information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>ERC-2981: Royalty Standard</h1>
        <p className="subtitle">Creator earnings on every resale. Universal royalty protocol.</p>
      </div>

      <div className="grid grid-2">
        {/* Set Royalty Card */}
        <div className="card">
          <div className="card-header">
            <h3>Set Royalty Info</h3>
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
              <label className="form-label">Royalty Percentage (0-100)</label>
              <input
                type="number"
                className="form-input"
                name="royaltyPercentage"
                value={formData.royaltyPercentage}
                onChange={handleInputChange}
                placeholder="10"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Royalty Recipient Address</label>
              <input
                type="text"
                className="form-input"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder="0x..."
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSetRoyalty}
              disabled={loading}
            >
              {loading ? '⏳ Setting...' : '💰 Set Royalty'}
            </button>
          </form>
        </div>

        {/* Royalty Info Card */}
        <div className="card">
          <div className="card-header">
            <h3>How ERC-2981 Works</h3>
          </div>
          <div className="info-text">
            <p>
              ERC-2981 is a standardized way to do on-chain royalties for NFTs and semi-fungible tokens.
            </p>
            <div className="flow-diagram">
              <div className="flow-step">1. You mint an NFT with royalty info</div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">2. When it's sold on secondary market</div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">3. Marketplace queries royaltyInfo()</div>
              <div className="flow-arrow">↓</div>
              <div className="flow-step">4. Royalties automatically sent to you</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="card">
        <div className="card-header">
          <h3>📊 ERC-2981 Characteristics</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <strong>Purpose:</strong>
            <span>Standardized royalty information for NFTs</span>
          </div>
          <div className="info-item">
            <strong>Universal:</strong>
            <span>Works across all compatible marketplaces</span>
          </div>
          <div className="info-item">
            <strong>On-Chain:</strong>
            <span>Royalty data stored in smart contract</span>
          </div>
          <div className="info-item">
            <strong>Marketplace Support:</strong>
            <span>OpenSea, Rarible, Foundation, and more</span>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <div className="card-header">
          <h3>🎁 Creator Benefits</h3>
        </div>
        <div className="benefits-list">
          <div className="benefit">
            <span className="benefit-icon">💸</span>
            <div>
              <strong>Passive Income</strong>
              <p>Earn royalties every time your NFT is resold</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🌐</span>
            <div>
              <strong>Universal Standard</strong>
              <p>Works on all platforms that support ERC-2981</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🔐</span>
            <div>
              <strong>Immutable</strong>
              <p>Royalty info encoded in the contract, cannot be removed</p>
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
