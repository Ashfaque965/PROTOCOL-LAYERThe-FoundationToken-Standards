import React from 'react';
import WalletButton from './WalletButton';
import './Navigation.css';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'erc721', label: 'ERC-721', description: 'Individual NFTs' },
    { id: 'erc1155', label: 'ERC-1155', description: 'Multi-Tokens' },
    { id: 'erc2981', label: 'ERC-2981', description: 'Royalties' },
    { id: 'erc4907', label: 'ERC-4907', description: 'Rentals' },
    { id: 'dynamic', label: 'Dynamic NFTs', description: 'Advanced' },
    { id: 'soulbound', label: 'Soulbound', description: 'SBTs' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🔥 NFT Protocol Layer</h1>
          <p>Token Standards & Advanced Mechanics</p>
        </div>

        <div className="navbar-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
            >
              <span className="tab-label">{tab.label}</span>
              <span className="tab-desc">{tab.description}</span>
            </button>
          ))}
        </div>

        <div className="navbar-wallet">
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
