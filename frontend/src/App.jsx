import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import Navigation from './components/Navigation';
import ERC721Dashboard from './components/standards/ERC721Dashboard';
import ERC1155Dashboard from './components/standards/ERC1155Dashboard';
import ERC2981Dashboard from './components/standards/ERC2981Dashboard';
import ERC4907Dashboard from './components/standards/ERC4907Dashboard';
import DynamicNFTDashboard from './components/features/DynamicNFTDashboard';
import SoulboundTokens from './components/features/SoulboundTokens';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('erc721');

  return (
    <WalletProvider>
      <div className="app-container">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="main-content">
          {activeTab === 'erc721' && <ERC721Dashboard />}
          {activeTab === 'erc1155' && <ERC1155Dashboard />}
          {activeTab === 'erc2981' && <ERC2981Dashboard />}
          {activeTab === 'erc4907' && <ERC4907Dashboard />}
          {activeTab === 'dynamic' && <DynamicNFTDashboard />}
          {activeTab === 'soulbound' && <SoulboundTokens />}
        </main>
      </div>
    </WalletProvider>
  );
}
