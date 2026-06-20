// Configuration for different networks
export const NETWORKS = {
  ETHEREUM_MAINNET: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
  },
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
  },
  POLYGON: {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
  },
  POLYGON_MUMBAI: {
    id: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorer: 'https://mumbai.polygonscan.com',
  },
  ARBITRUM: {
    id: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
  },
};

// Contract deployment addresses (update with your deployments)
export const CONTRACT_ADDRESSES = {
  ERC721: {
    [NETWORKS.SEPOLIA.id]: '0x...', // Replace with actual address
  },
  ERC1155: {
    [NETWORKS.SEPOLIA.id]: '0x...', // Replace with actual address
  },
  ERC2981: {
    [NETWORKS.SEPOLIA.id]: '0x...', // Replace with actual address
  },
  ERC4907: {
    [NETWORKS.SEPOLIA.id]: '0x...', // Replace with actual address
  },
};

// Gas configuration
export const GAS_CONFIG = {
  STANDARD: {
    gasPrice: 'standard',
    limit: 300000,
  },
  FAST: {
    gasPrice: 'fast',
    limit: 350000,
  },
  INSTANT: {
    gasPrice: 'instant',
    limit: 400000,
  },
};

// Token symbol and decimals
export const TOKEN_CONFIG = {
  DECIMALS: 18,
  SYMBOL: 'ETHER',
};

// UI Configuration
export const UI_CONFIG = {
  DEFAULT_NETWORK: NETWORKS.SEPOLIA.id,
  REFRESH_INTERVAL: 5000, // 5 seconds
  TRANSACTION_TIMEOUT: 60000, // 60 seconds
  MAX_RETRIES: 3,
};
