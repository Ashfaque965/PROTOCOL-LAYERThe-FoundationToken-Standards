import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import '../standards/StandardsCommon.css';

export default function DynamicNFTDashboard() {
  const { account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tokenId: '',
    updateType: 'stats',
    value: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateMetadata = async () => {
    if (!formData.tokenId || !formData.value) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      console.log('Updating dynamic NFT:', formData);
      setResult({
        type: 'success',
        message: `Metadata updated! Token now has new ${formData.updateType} value.`,
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
          <p>Please connect your wallet to interact with Dynamic NFTs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🔥 Dynamic NFTs - Advanced Mechanics</h1>
        <p className="subtitle">Metadata that changes based on external data, time, or game logic</p>
      </div>

      <div className="grid grid-2">
        {/* Update Metadata Card */}
        <div className="card">
          <div className="card-header">
            <h3>Update Metadata</h3>
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
              <label className="form-label">Update Type</label>
              <select
                className="form-select"
                name="updateType"
                value={formData.updateType}
                onChange={handleInputChange}
              >
                <option value="stats">Game Stats</option>
                <option value="level">Level/Experience</option>
                <option value="traits">Evolving Traits</option>
                <option value="oracle">Oracle Data</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">New Value</label>
              <input
                type="text"
                className="form-input"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter new value"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateMetadata}
              disabled={loading}
            >
              {loading ? '⏳ Updating...' : '🔄 Update Metadata'}
            </button>
          </form>
        </div>

        {/* Data Sources Card */}
        <div className="card">
          <div className="card-header">
            <h3>Data Sources</h3>
          </div>
          <div className="info-text">
            <p>Dynamic NFTs can pull data from:</p>
            <div className="source-list">
              <div className="source">
                <strong>🌐 Oracle Data</strong>
                <p>Real-world data (weather, prices, scores)</p>
              </div>
              <div className="source">
                <strong>🎮 Game Events</strong>
                <p>Player achievements and gameplay statistics</p>
              </div>
              <div className="source">
                <strong>⏰ Time-Based</strong>
                <p>Evolution or degradation based on time</p>
              </div>
              <div className="source">
                <strong>🤖 AI Logic</strong>
                <p>Generated attributes based on algorithms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Card */}
      <div className="card">
        <div className="card-header">
          <h3>📚 Dynamic NFT Examples</h3>
        </div>
        <div className="grid-3">
          <div className="example-box">
            <h4>🎮 Axie Infinity Monsters</h4>
            <p>Stats and appearance evolve through breeding and battles</p>
            <code className="example-code">health: 45 → 52 (after battles)</code>
          </div>
          <div className="example-box">
            <h4>☀️ Sunrise Flowers</h4>
            <p>Appearance changes based on real weather data</p>
            <code className="example-code">blooming: false → true (sunny day)</code>
          </div>
          <div className="example-box">
            <h4>📈 Loot Bags</h4>
            <p>Rendered metadata changes based on price feeds</p>
            <code className="example-code">rarity tier updates with ETH price</code>
          </div>
        </div>
      </div>

      {/* On-Chain Metadata Info */}
      <div className="card">
        <div className="card-header">
          <h3>💾 On-Chain vs Off-Chain Metadata</h3>
        </div>
        <div className="grid-2">
          <div className="comparison-box">
            <h4>🔗 On-Chain Metadata</h4>
            <div className="pros-cons">
              <div className="pros">
                <strong>Pros:</strong>
                <ul>
                  <li>Permanent & immutable</li>
                  <li>Direct contract interaction</li>
                  <li>No IPFS dependency</li>
                </ul>
              </div>
              <div className="cons">
                <strong>Cons:</strong>
                <ul>
                  <li>❌ Very expensive (high gas)</li>
                  <li>❌ Size limited</li>
                  <li>❌ Slower updates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="comparison-box">
            <h4>📊 Off-Chain Metadata</h4>
            <div className="pros-cons">
              <div className="pros">
                <strong>Pros:</strong>
                <ul>
                  <li>✓ Low cost</li>
                  <li>✓ Unlimited size</li>
                  <li>✓ Fast updates</li>
                </ul>
              </div>
              <div className="cons">
                <strong>Cons:</strong>
                <ul>
                  <li>⚠️ Depends on IPFS/servers</li>
                  <li>⚠️ Centralization risk</li>
                  <li>⚠️ Potential for changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Concepts */}
      <div className="card">
        <div className="card-header">
          <h3>⚙️ Advanced Concepts</h3>
        </div>
        <div className="concepts-grid">
          <div className="concept">
            <span className="concept-icon">📡</span>
            <h4>Chainlink VRF</h4>
            <p>Verifiable randomness for trait generation</p>
          </div>
          <div className="concept">
            <span className="concept-icon">🔗</span>
            <h4>Cross-Chain Data</h4>
            <p>Metadata influenced by multiple blockchains</p>
          </div>
          <div className="concept">
            <span className="concept-icon">🤖</span>
            <h4>AI Generation</h4>
            <p>SVG/PNG generated on-demand via generative models</p>
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

// Additional styles for this component
const styles = `
.source-list {
  margin: 1rem 0;
}

.source {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background-color: var(--bg-darker);
  border-radius: 0.5rem;
  border-left: 3px solid var(--warning-color);
}

.source strong {
  display: block;
  color: var(--warning-color);
  margin-bottom: 0.25rem;
}

.source p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.example-box {
  padding: 1.5rem;
  background-color: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}

.example-box h4 {
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.example-box p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.example-code {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  background-color: var(--bg-card);
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: var(--accent-color);
}

.comparison-box {
  padding: 1.5rem;
  background-color: var(--bg-darker);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.comparison-box h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.pros, .cons {
  font-size: 0.9rem;
}

.pros strong {
  color: var(--success-color);
}

.cons strong {
  color: var(--error-color);
}

.pros ul, .cons ul {
  list-style: none;
  margin-top: 0.5rem;
}

.pros li, .cons li {
  padding: 0.25rem 0;
  color: var(--text-secondary);
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.concept {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--warning-color)15, var(--accent-color)15);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  text-align: center;
}

.concept-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.concept h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.concept p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
`;
