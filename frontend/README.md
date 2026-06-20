# NFT Protocol Layer Frontend

A comprehensive web3 frontend for interacting with NFT token standards and advanced mechanics.

## 🚀 Features

### Token Standards
- **ERC-721**: Individual NFTs (art, certificates)
- **ERC-1155**: Multi-token standard (gaming, efficient batching)
- **ERC-2981**: Royalty standard (creator earnings)
- **ERC-4907**: Rental NFTs (time-based access)

### Advanced Mechanics
- **Dynamic NFTs**: Metadata that evolves over time
- **Soulbound Tokens**: Non-transferable identity badges

## 📋 Getting Started

### Prerequisites
- Node.js 16+
- MetaMask or compatible Web3 wallet
- React 18+

### Installation

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── standards/          # ERC standard dashboards
│   │   ├── features/           # Advanced feature dashboards
│   │   ├── Navigation.jsx
│   │   └── WalletButton.jsx
│   ├── context/
│   │   └── WalletContext.jsx   # Wallet state management
│   ├── hooks/
│   │   ├── useWallet.js
│   │   └── useContract.js
│   ├── services/               # Web3 services
│   ├── utils/                  # Utility functions
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 Using the Dashboard

### 1. Connect Wallet
Click the "🦊 Connect Wallet" button and approve the MetaMask request.

### 2. Select Token Standard
Choose from the navigation tabs:
- ERC-721 for individual NFTs
- ERC-1155 for multi-tokens
- ERC-2981 for royalties
- ERC-4907 for rentals
- Dynamic NFTs for evolving metadata
- Soulbound for non-transferable credentials

### 3. Interact with Contracts
Fill in the required fields and submit transactions through your wallet.

## 📝 Contract Integration

Each dashboard component uses the `useContract` hook to interact with deployed contracts:

```javascript
import { useContract } from '../hooks/useContract';

const contract = useContract(contractAddress, contractABI);
// Now you can call contract methods
```

## 🔌 Connecting to Your Contracts

Replace contract addresses and ABIs in each dashboard component:

```javascript
const CONTRACT_ADDRESS = '0x...';
const CONTRACT_ABI = [...]; // Import from contract build files
```

## 🌐 Network Support

This frontend supports:
- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Any EVM-compatible chain

Switch networks in MetaMask to change the connected blockchain.

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Run Type Checking
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

## 📚 Resources

- [ERC Standards on Ethereum](https://eips.ethereum.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT
