## Frontend Installation & Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- MetaMask browser extension

### Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Environment Setup

Create a `.env.local` file if needed for custom configurations:

```
VITE_RPC_URL=https://rpc.sepolia.org
VITE_BLOCK_EXPLORER=https://sepolia.etherscan.io
VITE_NETWORK_ID=11155111
```

### Connecting to Your Contracts

1. Update contract addresses in `src/config/index.js`
2. Import contract ABIs from your smart contracts
3. Update `src/utils/contractABIs.js` with your ABIs
4. Use the contract addresses in each dashboard component

### Testing with Testnet

**Recommended: Sepolia Testnet**

1. Switch to Sepolia in MetaMask
2. Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com)
3. Deploy your contracts to Sepolia
4. Update the contract addresses in the frontend config

### Troubleshooting

**Issue**: "Wallet not connected"
- Solution: Install MetaMask and enable it for this site

**Issue**: "Gas estimation failed"
- Solution: Ensure you have enough testnet ETH and correct contract addresses

**Issue**: "Contract call failed"
- Solution: Check contract ABIs match your deployed contracts

### Development Tips

1. Use React DevTools for debugging components
2. Check browser console for errors
3. Use MetaMask's network switcher to test different chains
4. Test transactions on testnet first

### Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   ├── context/            # Context providers (wallet)
│   ├── hooks/              # Custom hooks
│   ├── services/           # Business logic (contract interactions)
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
└── package.json            # Dependencies
```

### Available Scripts

### `npm run dev`
Runs the development server with hot reload

### `npm run build`
Builds for production 

### `npm run preview`
Preview production build locally

### `npm run lint`
Lint code for errors

### `npm run type-check`
TypeScript type checking

### Common Tasks

**Add a new NFT standard dashboard:**
1. Create new file in `src/components/standards/`
2. Import dashboard in `App.jsx`
3. Add tab in Navigation component
4. Create corresponding CSS file

**Add wallet support:**
1. Update `WalletContext.jsx` to support more wallets
2. Use WalletConnect or other libraries

**Customize styling:**
- Edit `src/App.css` for global styles
- Component-specific styles in component CSS files
- Update CSS variables in `:root` selector

### Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Documentation](https://docs.metamask.io/)
