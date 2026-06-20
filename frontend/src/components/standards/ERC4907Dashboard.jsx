import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import './StandardsCommon.css';

export default function ERC4907Dashboard() {
  const { account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractAddress: '',
    tokenId: '',
    renterAddress: '',
    rentalDays: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSetUser = async () => {
    if (!formData.renterAddress || !formData.rentalDays) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      console.log('Setting user (rental):', formData);
      const days = parseInt(formData.rentalDays);
      const expiryTime = Math.floor(Date.now() / 1000) + (days * 86400);
      setResult({
        type: 'success',
        message: `NFT rented for ${days} days until ${new Date(expiryTime * 1000).toLocaleDateString()}`,
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
          <p>Please connect your wallet to manage NFT rentals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>ERC-4907: Rental NFT Standard</h1>
        <p className="subtitle">Separate owner and user roles. Perfect for rental models.</p>
      </div>

      <div className="grid grid-2">
        {/* Set Rental Card */}
        <div className="card">
          <div className="card-header">
            <h3>Create Rental Agreement</h3>
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
              <label className="form-label">Renter Address</label>
              <input
                type="text"
                className="form-input"
                name="renterAddress"
                value={formData.renterAddress}
                onChange={handleInputChange}
                placeholder="0x..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rental Duration (Days)</label>
              <input
                type="number"
                className="form-input"
                name="rentalDays"
                value={formData.rentalDays}
                onChange={handleInputChange}
                placeholder="30"
                min="1"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSetUser}
              disabled={loading}
            >
              {loading ? '⏳ Creating...' : '🏥 Create Rental'}
            </button>
          </form>
        </div>

        {/* How It Works Card */}
        <div className="card">
          <div className="card-header">
            <h3>📋 Rental Model</h3>
          </div>
          <div className="info-text">
            <p>ERC-4907 introduces two roles:</p>
            <div className="role-list">
              <div className="role">
                <strong>Owner</strong>
                <p>Receives rental fees, can recall NFT after expiry</p>
              </div>
              <div className="role">
                <strong>User</strong>
                <p>Can use the NFT during rental period, cannot transfer</p>
              </div>
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Perfect for virtual real estate, gaming gear, and equipment rentals.
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="card">
        <div className="card-header">
          <h3>📊 ERC-4907 Characteristics</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <strong>Dual Roles:</strong>
            <span>Owner and User have separate permissions</span>
          </div>
          <div className="info-item">
            <strong>Time-Based:</strong>
            <span>Rental expires after specified duration</span>
          </div>
          <div className="info-item">
            <strong>Use Cases:</strong>
            <span>Virtual property, equipment, in-game items</span>
          </div>
          <div className="info-item">
            <strong>Compatibility:</strong>
            <span>Built on ERC721, backward compatible</span>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="card">
        <div className="card-header">
          <h3>🚀 Real-World Use Cases</h3>
        </div>
        <div className="use-cases-grid">
          <div className="use-case">
            <h4>🏘️ Virtual Real Estate</h4>
            <p>Rent out virtual land in metaverses</p>
          </div>
          <div className="use-case">
            <h4>🎮 Gaming Items</h4>
            <p>Rent weapons, armor, and cosmetics</p>
          </div>
          <div className="use-case">
            <h4>🎨 Domain Names</h4>
            <p>Temporary domain ownership</p>
          </div>
          <div className="use-case">
            <h4>📱 Subscription Services</h4>
            <p>Time-limited access to premium features</p>
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
