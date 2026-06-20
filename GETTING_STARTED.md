# NFT Protocol Layer - Quick Start Guide

## 🚀 Getting Started

This comprehensive NFT protocol resource includes documentation, smart contracts, and implementation examples for all major NFT standards.

---

## 📋 What's Included

### Documentation

#### Token Standards
- **ERC-721**: The foundational NFT standard (1 NFT = 1 unique token)
- **ERC-1155**: Multi-token standard (fungible + non-fungible in one contract)
- **ERC-2981**: Royalty standard (automatic creator payments)
- **ERC-4907**: Rental standard (separate owner and user roles)
- **ERC-4337**: Account abstraction (smart contract wallets)
- **ERC-6551**: Token bound accounts (NFTs own their own wallets) 🔥

#### Advanced Mechanics
- **On-Chain Metadata**: 100% permanent storage in contract
- **Dynamic NFTs**: Metadata changes based on events/time/data
- **Soulbound Tokens**: Non-transferable identity credentials

### Smart Contracts

#### Standard Implementations
- `ERC721.sol` - Basic NFT contract
- `ERC1155.sol` - Multi-token contract
- `ERC2981.sol` - Royalty-enabled NFT
- `ERC4907.sol` - Rental-enabled NFT
- `ERC4337.sol` - Smart wallet implementation
- `ERC6551.sol` - Token bound account implementation

#### Advanced Implementations
- `DynamicNFT.sol` - Evolving game character
- `SoulboundToken.sol` - Non-transferable credentials
- `OnChainMetadata.sol` - Fully on-chain metadata

#### Examples
- `NFTPatterns.sol` - Common usage patterns

---

## 🎯 Choosing the Right Standard

### Use Case Decision Tree

```
Is it a single, unique item?
├─ YES → ERC-721
├─ NO → Multiple token types?
    ├─ YES → ERC-1155
    └─ NO → Single fungible token → Use ERC-20

Does creator deserve ongoing royalties?
├─ YES → Add ERC-2981 support

Do you need rental/leasing?
├─ YES → Use ERC-4907

Do users need smart wallets?
├─ YES → Use ERC-4337

Do NFTs need to own assets?
├─ YES → Use ERC-6551 🔥

Is metadata permanent and on-chain?
├─ YES → On-Chain Metadata pattern

Does metadata change over time?
├─ YES → Dynamic NFT pattern

Is it a non-transferable credential?
├─ YES → Soulbound Token
```

---

## 🛠️ Deployment Steps

### 1. Setup Environment

```bash
# Install dependencies
npm install @openzeppelin/contracts

# Or with Hardhat
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

### 2. Choose Your Contract

Select from `contracts/standards/` or `contracts/advanced/`

### 3. Customize

- Update contract name and symbol
- Set base URI for metadata
- Configure access control
- Adjust minting parameters

### 4. Test

```bash
npx hardhat test
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Deploy

```bash
# Testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

---

## 📚 Real-World Examples

### Example 1: Gaming Item (ERC-1155 + Dynamic)

```solidity
// Weapon starts as common, levels up with use
- Mint as: Common Sword
- Combat events trigger: gainExperience()
- After 50 battles: Rare Sword (metadata changes)
- After 100 battles: Epic Sword (new abilities unlock)
```

### Example 2: Creator NFT (ERC-721 + ERC-2981)

```solidity
// Artist mints art with 10% royalty
- Collection: Abstract Art #1-100
- Primary sale: Sold for 10 ETH
- Secondary sale: Artist gets 1 ETH (10%)
- Marketplace automatically handles distribution
```

### Example 3: Identity System (Soulbound Token)

```solidity
// University issues diplomas
- Issue: Bachelor of Science to graduate
- Non-transferable: Can't be sold
- Verifiable: Blockchain proof of education
- Permanent: Forever attached to wallet
```

### Example 4: NFT-Controlled Wallet (ERC-6551)

```solidity
// NFT character with inventory
- Create: Dragon NFT
- Issue TBA: 0x7a9c...
- Store loot: Sword, Shield, Gold in TBA
- Transfer NFT: Loot follows automatically
- Auto-execute: Contracts interact with TBA
```

---

## 🔐 Security Checklist

- [ ] Use OpenZeppelin audited contracts
- [ ] Implement access control (Ownable/AccessControl)
- [ ] Prevent re-entrancy with nonReentrant
- [ ] Use SafeMath (built-in for Solidity 0.8+)
- [ ] Validate all inputs
- [ ] Test thoroughly before mainnet
- [ ] Get professional audit for production
- [ ] Implement pause mechanism for emergencies

---

## 📊 Gas Optimization Tips

### Reduce Gas Costs

1. **Batch Operations** (ERC-1155)
   - One transfer for multiple items

2. **Lazy Evaluation**
   - Calculate metadata on-the-fly instead of storing

3. **Packed Storage**
   - Use uint8 instead of uint256 when possible

4. **Storage Minimization**
   - Use mappings instead of arrays
   - Store critical data only

### Estimate Costs

- ERC-721 mint: ~45,000 gas
- ERC-1155 mint: ~35,000 gas
- Transfer: ~20,500 gas
- Approve: ~22,900 gas

---

## 🌐 Network Details

### Ethereum Mainnet
- Chain ID: 1
- RPC: https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

### Sepolia Testnet
- Chain ID: 11155111
- RPC: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
- Faucet: https://sepoliafaucet.com

### Other Networks
- Polygon: https://polygonscan.com
- Arbitrum: https://arbitrum.io
- Optimism: https://optimism.io

---

## 📖 Helpful Resources

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum.org NFT Guide](https://ethereum.org/en/nft/)
- [EIP Standards](https://eips.ethereum.org/)
- [Remix IDE](https://remix.ethereum.org/)

---

## 🤝 Contributing

This is an educational resource. Feel free to:
- Fork and modify for your projects
- Report issues or suggest improvements
- Share your implementations
- Help documentation grow

---

## ⚠️ Disclaimer

These contracts are educational examples. Always:
- Review security implications
- Test thoroughly
- Get professional audits before mainnet
- Understand each standard before using
- Not financial advice

---

## 🎓 Learning Path

**Beginner:** Start with ERC-721 documentation and SimpleNFT.sol

**Intermediate:** Explore ERC-1155 and RoyaltyNFT for advanced patterns

**Advanced:** Study ERC-6551 and DynamicNFT for cutting-edge concepts

---

## 📞 Support

- Read documentation in `docs/`
- Review contracts in `contracts/`
- Study examples in `examples/`
- Reference OpenZeppelin docs

---

## 📝 License

This project is open source and available under the MIT License.

---

**Start building amazing NFT applications today!** 🚀
