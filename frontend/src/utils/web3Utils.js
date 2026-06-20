/**
 * Utility functions for Web3 interactions
 */

/**
 * Format a wallet address to a shorter version
 * @param {string} address - Full wallet address
 * @param {number} startChars - Number of characters to show at start (default: 6)
 * @param {number} endChars - Number of characters to show at end (default: 4)
 * @returns {string} Formatted address
 */
export function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validate if a string is a valid Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} Whether the address is valid
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert Wei to Ether
 * @param {string|BigNumber} wei - Amount in Wei
 * @returns {string} Amount in Ether
 */
export function weiToEther(wei) {
  const etherAmount = wei / 1e18;
  return etherAmount.toFixed(6);
}

/**
 * Convert Ether to Wei
 * @param {string|number} ether - Amount in Ether
 * @returns {string} Amount in Wei
 */
export function etherToWei(ether) {
  return Math.floor(ether * 1e18).toString();
}

/**
 * Get network name from chain ID
 * @param {number} chainId - Chain ID
 * @returns {string} Network name
 */
export function getNetworkName(chainId) {
  const networks = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Goerli',
    42: 'Kovan',
    137: 'Polygon',
    80001: 'Polygon Mumbai',
    43113: 'Avalanche Fuji',
    43114: 'Avalanche C-Chain',
    56: 'BSC Mainnet',
    97: 'BSC Testnet',
    42161: 'Arbitrum One',
    421613: 'Arbitrum Goerli',
  };
  return networks[chainId] || `Chain ${chainId}`;
}

/**
 * Get block explorer URL for a transaction
 * @param {string} txHash - Transaction hash
 * @param {number} chainId - Chain ID
 * @returns {string} Block explorer URL
 */
export function getTxExplorerUrl(txHash, chainId) {
  const explorers = {
    1: `https://etherscan.io/tx/${txHash}`,
    3: `https://ropsten.etherscan.io/tx/${txHash}`,
    4: `https://rinkeby.etherscan.io/tx/${txHash}`,
    5: `https://goerli.etherscan.io/tx/${txHash}`,
    137: `https://polygonscan.com/tx/${txHash}`,
    80001: `https://mumbai.polygonscan.com/tx/${txHash}`,
  };
  return explorers[chainId] || `https://etherscan.io/tx/${txHash}`;
}

/**
 * Get address explorer URL
 * @param {string} address - Wallet address
 * @param {number} chainId - Chain ID
 * @returns {string} Block explorer URL
 */
export function getAddressExplorerUrl(address, chainId) {
  const explorers = {
    1: `https://etherscan.io/address/${address}`,
    3: `https://ropsten.etherscan.io/address/${address}`,
    4: `https://rinkeby.etherscan.io/address/${address}`,
    5: `https://goerli.etherscan.io/address/${address}`,
    137: `https://polygonscan.com/address/${address}`,
    80001: `https://mumbai.polygonscan.com/address/${address}`,
  };
  return explorers[chainId] || `https://etherscan.io/address/${address}`;
}

/**
 * Check if a transaction receipt is successful
 * @param {object} receipt - Transaction receipt
 * @returns {boolean} Whether the transaction succeeded
 */
export function isTxSuccessful(receipt) {
  return receipt && receipt.status === 1;
}

/**
 * Format a number with comma separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Delay execution (useful for retries)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delayMs - Initial delay in milliseconds
 * @returns {Promise} Result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await sleep(delayMs * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
}

/**
 * Parse IPFS or HTTP URL
 * @param {string} uri - URI to parse
 * @returns {string} HTTP URL
 */
export function parseIPFSUrl(uri) {
  if (!uri) return '';
  if (uri.startsWith('http')) return uri;
  if (uri.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }
  return uri;
}

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return (value / total) * 100;
}
