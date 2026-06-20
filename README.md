# NFT Protocol Layer - The Foundation

Complete guide to NFT token standards and advanced mechanics. This repository contains documentation, smart contract templates, and best practices for building next-generation NFT applications.

## 📚 Table of Contents

- [Token Standards](#token-standards)
- [Advanced Mechanics](#advanced-mechanics)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

---

## 🔗 Token Standards

### Core ERC Standards

| Standard | Type | Use Cases | Key Features |
|----------|------|-----------|--------------|
| **ERC-721** | Non-Fungible | Art, Certificates | 1 NFT = 1 unique token |
| **ERC-1155** | Multi-Token | Gaming, Collections | Fungible + Non-Fungible, Gas efficient |
| **ERC-2981** | Royalty | Creator Rights | Automatic royalty distribution |
| **ERC-4907** | Rental | Asset Lending | Temporary ownership transfer |
| **ERC-4337** | Account Abstraction | Wallet Innovation | Smart contract wallets |
| **ERC-6551** | Token Bound Accounts | NFT Autonomy | NFTs own their own wallets 🔥 |

### Documentation
- [ERC-721 Standard](./docs/token-standards/ERC-721.md)
- [ERC-1155 Standard](./docs/token-standards/ERC-1155.md)
- [ERC-2981 Standard](./docs/token-standards/ERC-2981.md)
- [ERC-4907 Standard](./docs/token-standards/ERC-4907.md)
- [ERC-4337 Standard](./docs/token-standards/ERC-4337.md)
- [ERC-6551 Standard](./docs/token-standards/ERC-6551.md)

---

## 🔥 Advanced NFT Mechanics

### 1. On-Chain Metadata
Store JSON directly in contract for permanent, transparent metadata.

**Pros:** Immutable, transparent, on-chain history  
**Cons:** High gas costs, limited to smaller files  

### 2. Dynamic NFTs
Metadata changes based on external or internal triggers.

**Change Triggers:**
- Oracle data integration
- Game stats & progression
- Time-based evolution
- AI logic & randomness

### 3. Soulbound Tokens (SBTs)
Non-transferable NFTs representing personal achievements.

**Use Cases:**
- Academic Degrees
- Digital Identity
- Reputation & Credentials
- Skill Certifications

---

## 🚀 Getting Started

### Prerequisites
- Solidity knowledge (v0.8.0+)
- Foundry or Hardhat for deployment
- Understanding of ERC standards

### Quick Start

1. **Review Documentation**
   ```
   Browse docs/token-standards for detailed information on each ERC standard
   ```

2. **Explore Contract Templates**
   ```
   contracts/standards/ - Minimal implementations
   contracts/advanced/ - Advanced implementations with features
   ```

3. **Study Examples**
   ```
   examples/ - Real-world implementation patterns
   ```

---

## 📁 Project Structure

```
NFT-Protocol-Layer/
├── README.md                          # This file
├── docs/
│   ├── token-standards/               # Detailed ERC documentation
│   │   ├── ERC-721.md
│   │   ├── ERC-1155.md
│   │   ├── ERC-2981.md
│   │   ├── ERC-4907.md
│   │   ├── ERC-4337.md
│   │   └── ERC-6551.md
│   └── advanced-mechanics/            # Advanced concepts
│       ├── on-chain-metadata.md
│       ├── dynamic-nfts.md
│       └── soulbound-tokens.md
├── contracts/
│   ├── standards/                     # Standard implementations
│   │   ├── ERC721.sol
│   │   ├── ERC1155.sol
│   │   ├── ERC2981.sol
│   │   ├── ERC4907.sol
│   │   ├── ERC4337.sol
│   │   └── ERC6551.sol
│   └── advanced/                      # Advanced implementations
│       ├── DynamicNFT.sol
│       ├── SoulboundToken.sol
│       └── OnChainMetadata.sol
├── interfaces/                        # Interface definitions
├── examples/                          # Implementation examples
└── LICENSE
```

---

## 📖 Standards Overview

### ERC-721: The Classic NFT Standard
One token per NFT. Perfect for unique digital assets like art or certificates.

### ERC-1155: The Multi-Purpose Standard
Single contract for both fungible (tokens) and non-fungible (NFTs) assets. Essential for gaming.

### ERC-2981: Creator Royalties
Enable automatic royalty payments to creators on secondary sales.

### ERC-4907: Rental & Leasing
Allow temporary usage rights while maintaining permanent ownership.

### ERC-4337: Account Abstraction
Create smart contract wallets independent of EOAs (Externally Owned Accounts).

### ERC-6551: Token Bound Accounts 🔥
Revolutionary: NFTs can own assets, participate in transactions, and have autonomous wallets.

---

## 🔬 Advanced Concepts

### On-Chain Metadata
- Full JSON storage in contract
- Permanent, immutable records
- Higher gas costs
- Best for important metadata (deeds, certificates)

### Dynamic NFTs
- Metadata updates trigger smart contract state changes
- Powered by oracles, game data, or time-based logic
- Examples: Evolving creatures, skill-based avatars

### Soulbound Tokens
- Non-transferable by design
- Perfect for identity, credentials, reputation
- Building blocks for on-chain societies

---

## 🎯 Use Case Matrix

| Use Case | Best Standard | Why |
|----------|---------------|-----|
| Digital Art | ERC-721 | Simple, proven, standard |
| Gaming Assets | ERC-1155 | Multi-token efficiency |
| Creator Rights | ERC-2981 | Royalty automation |
| Asset Lending | ERC-4907 | Built-in rental mechanics |
| Smart Wallets | ERC-4337 | Account abstraction |
| NFT Autonomy | ERC-6551 | Self-owned wallets |
| Identity | Soulbound | Non-transferable reputation |
| Dynamic Art | Dynamic NFT | Evolving metadata |

---

## 📚 Resources

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ERC Standards (EIPs)](https://eips.ethereum.org/)
- [Ethereum Development](https://ethereum.org/en/developers/)

---

## 📝 License

This project is open source and available under the MIT License.

---

**Ready to build the future of NFTs? Start with the documentation and explore the contract templates!** 🚀
