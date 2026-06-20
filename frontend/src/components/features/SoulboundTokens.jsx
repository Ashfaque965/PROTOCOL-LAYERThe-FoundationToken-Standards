import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import '../standards/StandardsCommon.css';

export default function SoulboundTokens() {
  const { account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractAddress: '',
    recipientAddress: '',
    certificationType: 'degree',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIssue = async () => {
    if (!formData.recipientAddress) {
      alert('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      console.log('Issuing Soulbound Token:', formData);
      setResult({
        type: 'success',
        message: `Soulbound ${formData.certificationType} issued to ${formData.recipientAddress.slice(0, 6)}...`,
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
          <p>Please connect your wallet to issue Soulbound Tokens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Soulbound Tokens (SBTs) - Non-Transferable NFTs</h1>
        <p className="subtitle">Permanent identity badges. Cannot be sold or transferred.</p>
      </div>

      <div className="grid grid-2">
        {/* Issue Token Card */}
        <div className="card">
          <div className="card-header">
            <h3>Issue Soulbound Token</h3>
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
              <label className="form-label">Recipient Address</label>
              <input
                type="text"
                className="form-input"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                placeholder="0x..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Certification Type</label>
              <select
                className="form-select"
                name="certificationType"
                value={formData.certificationType}
                onChange={handleInputChange}
              >
                <option value="degree">University Degree</option>
                <option value="certificate">Professional Certificate</option>
                <option value="credential">Skill Credential</option>
                <option value="membership">Community Membership</option>
                <option value="achievement">Achievement Badge</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleIssue}
              disabled={loading}
            >
              {loading ? '⏳ Issuing...' : '🏆 Issue SBT'}
            </button>
          </form>
        </div>

        {/* What Are SBTs Card */}
        <div className="card">
          <div className="card-header">
            <h3>What are SBTs?</h3>
          </div>
          <div className="info-text">
            <p>
              <strong>Soulbound Tokens</strong> are non-transferable NFTs that represent an individual's or entity's credentials and commitments.
            </p>
            <div className="sbt-features">
              <div className="feature">
                🔒 <strong>Non-Transferable</strong> - Cannot be bought, sold, or given away
              </div>
              <div className="feature">
                👤 <strong>Identity-Bound</strong> - Linked to a specific person/entity
              </div>
              <div className="feature">
                ✅ <strong>Verifiable</strong> - Publicly verifiable on blockchain
              </div>
              <div className="feature">
                🏛️ <strong>Authority-Issued</strong> - Issued by trusted institutions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Card */}
      <div className="card">
        <div className="card-header">
          <h3>🎓 Real-World Use Cases</h3>
        </div>
        <div className="use-cases-grid">
          <div className="use-case">
            <h4>🎓 Educational Credentials</h4>
            <p>University degrees and diplomas</p>
          </div>
          <div className="use-case">
            <h4>💼 Professional Certifications</h4>
            <p>Medical licenses, professional memberships</p>
          </div>
          <div className="use-case">
            <h4>🏅 Reputation Badges</h4>
            <p>DAO membership, contributor status</p>
          </div>
          <div className="use-case">
            <h4>🏥 Medical Records</h4>
            <p>Vaccination records, health credentials</p>
          </div>
          <div className="use-case">
            <h4>🌱 Skill Credentials</h4>
            <p>Technical skills, course completions</p>
          </div>
          <div className="use-case">
            <h4>👮 Identity Verification</h4>
            <p>Age verification, KYC badges</p>
          </div>
        </div>
      </div>

      {/* SBTs vs NFTs Comparison */}
      <div className="card">
        <div className="card-header">
          <h3>📊 SBTs vs Traditional NFTs</h3>
        </div>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Soulbound Tokens</th>
                <th>Traditional NFTs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Transferable</strong></td>
                <td>❌ No</td>
                <td>✅ Yes</td>
              </tr>
              <tr>
                <td><strong>Primary Use</strong></td>
                <td>Identity & credentials</td>
                <td>Ownership & collectibles</td>
              </tr>
              <tr>
                <td><strong>Resale Market</strong></td>
                <td>❌ None</td>
                <td>✅ Active</td>
              </tr>
              <tr>
                <td><strong>Verification</strong></td>
                <td>Proves achievement</td>
                <td>Proves ownership</td>
              </tr>
              <tr>
                <td><strong>Revokable</strong></td>
                <td>✅ Can be revoked</td>
                <td>❌ Cannot be revoked</td>
              </tr>
              <tr>
                <td><strong>Value</strong></td>
                <td>Social/Reputational</td>
                <td>Market price</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Card */}
      <div className="card">
        <div className="card-header">
          <h3>🚀 Benefits & Advantages</h3>
        </div>
        <div className="benefits-list">
          <div className="benefit">
            <span className="benefit-icon">🛡️</span>
            <div>
              <strong>Anti-Forgery</strong>
              <p>Non-transferability prevents counterfeit credential markets</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">📍</span>
            <div>
              <strong>Identity Mapping</strong>
              <p>Track who has what credentials, not just who owns tokens</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🌐</span>
            <div>
              <strong>Decentralized Credentials</strong>
              <p>No centralized database needed, on blockchain forever</p>
            </div>
          </div>
          <div className="benefit">
            <span className="benefit-icon">⚡</span>
            <div>
              <strong>Low Cost</strong>
              <p>No secondary market volatility, predictable value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Steps */}
      <div className="card">
        <div className="card-header">
          <h3>🔧 Implementation Path</h3>
        </div>
        <div className="implementation-steps">
          <div className="step">
            <span className="step-number">1</span>
            <div>
              <strong>Create Issuer Role</strong>
              <p>Define who can issue SBTs (universities, companies, DAOs)</p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <div>
              <strong>Design Token Metadata</strong>
              <p>Include issuer, issue date, credential type, expiration (optional)</p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <div>
              <strong>Mint to Recipients</strong>
              <p>Issue SBTs to verified recipient addresses</p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <div>
              <strong>Verify & Display</strong>
              <p>Recipients can display SBTs in digital wallets or profiles</p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">5</span>
            <div>
              <strong>Revoke if Needed</strong>
              <p>Issuer can burn/revoke if credentials become invalid</p>
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
