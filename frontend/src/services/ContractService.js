/**
 * Contract interaction service
 * Handles all contract calls and transactions
 */

import { Contract } from 'ethers';

export class ContractService {
  constructor(signer) {
    this.signer = signer;
  }

  /**
   * Create a contract instance
   * @param {string} address - Contract address
   * @param {array} abi - Contract ABI
   * @returns {Contract} Contract instance
   */
  async getContract(address, abi) {
    if (!this.signer) {
      throw new Error('Signer not available');
    }
    return new Contract(address, abi, this.signer);
  }

  /**
   * Mint an ERC-721 token
   * @param {string} contractAddress - Contract address
   * @param {string} tokenURI - Token metadata URI
   * @returns {object} Transaction result
   */
  async mintERC721(contractAddress, abi, tokenURI) {
    const contract = await this.getContract(contractAddress, abi);
    const tx = await contract.mint(this.signer.getAddress(), tokenURI);
    const receipt = await tx.wait();
    return { tx, receipt };
  }

  /**
   * Transfer an ERC-721 token
   * @param {string} contractAddress - Contract address
   * @param {string} toAddress - Recipient address
   * @param {number} tokenId - Token ID
   * @returns {object} Transaction result
   */
  async transferERC721(contractAddress, abi, toAddress, tokenId) {
    const contract = await this.getContract(contractAddress, abi);
    const senderAddress = await this.signer.getAddress();
    const tx = await contract.transferFrom(senderAddress, toAddress, tokenId);
    const receipt = await tx.wait();
    return { tx, receipt };
  }

  /**
   * Batch mint ERC-1155 tokens
   * @param {string} contractAddress - Contract address
   * @param {number} tokenId - Token ID
   * @param {number} amount - Amount to mint
   * @returns {object} Transaction result
   */
  async batchMintERC1155(contractAddress, abi, tokenId, amount) {
    const contract = await this.getContract(contractAddress, abi);
    const recipientAddress = await this.signer.getAddress();
    const tx = await contract.mint(recipientAddress, tokenId, amount, '0x');
    const receipt = await tx.wait();
    return { tx, receipt };
  }

  /**
   * Batch transfer ERC-1155 tokens
   * @param {string} contractAddress - Contract address
   * @param {string} toAddress - Recipient address
   * @param {number} tokenId - Token ID
   * @param {number} amount - Amount to transfer
   * @returns {object} Transaction result
   */
  async batchTransferERC1155(contractAddress, abi, toAddress, tokenId, amount) {
    const contract = await this.getContract(contractAddress, abi);
    const senderAddress = await this.signer.getAddress();
    const tx = await contract.safeTransferFrom(
      senderAddress,
      toAddress,
      tokenId,
      amount,
      '0x'
    );
    const receipt = await tx.wait();
    return { tx, receipt };
  }

  /**
   * Set royalty info (ERC-2981)
   * @param {string} contractAddress - Contract address
   * @param {string} receiver - Royalty receiver address
   * @param {number} percentage - Royalty percentage (0-10000, where 10000 = 100%)
   * @returns {object} Transaction result
   */
  async setRoyalty(contractAddress, abi, receiver, percentage) {
    const contract = await this.getContract(contractAddress, abi);
    const feeNumerator = Math.floor((percentage / 100) * 10000);
    const tx = await contract.setDefaultRoyalty(receiver, feeNumerator);
    const receipt = await tx.wait();
    return { tx, receipt };
  }

  /**
   * Get royalty info (ERC-2981)
   * @param {string} contractAddress - Contract address
   * @param {number} tokenId - Token ID
   * @param {number} salePrice - Sale price in Wei
   * @returns {object} Royalty info { receiver, royaltyAmount }
   */
  async getRoyaltyInfo(contractAddress, abi, tokenId, salePrice) {
    const contract = new Contract(contractAddress, abi, this.signer.provider);
    const [receiver, royaltyAmount] = await contract.royaltyInfo(tokenId, salePrice);
    return { receiver, royaltyAmount };
  }

  /**
   * Set user for rental (ERC-4907)
   * @param {string} contractAddress - Contract address
   * @param {number} tokenId - Token ID
   * @param {string} userAddress - User address
   * @param {number} expiryTime - Unix timestamp when rental expires
   * @returns {object} Transaction result
   */
  async setRentalUser(contractAddress, abi, tokenId, userAddress, expiryTime) {
    const contract = await this.getContract(contractAddress, abi);
    const tx = await contract.setUser(tokenId, userAddress, expiryTime);
    const receipt = await tx.wait();
    return { tx, receipt };
  }

  /**
   * Get current user of rental (ERC-4907)
   * @param {string} contractAddress - Contract address
   * @param {number} tokenId - Token ID
   * @returns {string} User address
   */
  async getRentalUser(contractAddress, abi, tokenId) {
    const contract = new Contract(contractAddress, abi, this.signer.provider);
    return await contract.userOf(tokenId);
  }

  /**
   * Get rental expiry time (ERC-4907)
   * @param {string} contractAddress - Contract address
   * @param {number} tokenId - Token ID
   * @returns {number} Unix timestamp
   */
  async getRentalExpiry(contractAddress, abi, tokenId) {
    const contract = new Contract(contractAddress, abi, this.signer.provider);
    return await contract.userExpires(tokenId);
  }

  /**
   * Estimate gas for a transaction
   * @param {string} contractAddress - Contract address
   * @param {string} methodName - Method name
   * @param {array} params - Method parameters
   * @returns {BigNumber} Estimated gas
   */
  async estimateGas(contractAddress, abi, methodName, params) {
    const contract = new Contract(contractAddress, abi, this.signer);
    return await contract.estimateGas[methodName](...params);
  }
}

export default ContractService;
