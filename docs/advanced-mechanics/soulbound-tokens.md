# Soulbound Tokens (SBTs): Non-Transferable Identity

## Overview

Soulbound Tokens are **non-transferable NFTs** that represent personal achievements, credentials, or identity. Unlike tradeable NFTs, they "bind" to an address and cannot be sold or transferred.

**Key Principle:** Identity over ownership

---

## Core Concepts

### Transferable NFT (ERC-721)
```
Owner: Alice
State: Can transfer to anyone
Action: Transfer → Bob now owns it
Problem: No link to Alice's identity
```

### Soulbound Token
```
Owner: Alice
State: Permanently bound to Alice
Action: Cannot transfer (SBT property)
Benefit: Proves Alice earned/received this
```

---

## Why Non-Transferable?

### 1. Prevents Market Gaming
```
❌ Bad: Buy diploma from other person
✅ Good: Diploma proves YOUR achievement
```

### 2. Maintains Authenticity
```
❌ Fake: Bought achievement
✅ Real: Earned achievement
```

### 3. Social Verification
```
✅ Reputable: Person has credential SBT
✅ Linked: Directly to their wallet
✅ Permanent: Can't be sold away
```

---

## Core Implementation

### Basic Soulbound Token

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundToken is ERC721, Ownable {
    
    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);
    
    constructor() ERC721("Soulbound Token", "SBT") {}
    
    // Disable all transfers
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(
            from == address(0) || to == address(0),
            "Cannot transfer - token is soulbound"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    // Issuer mints SBT to recipient
    function attest(address to, uint256 tokenId) external onlyOwner {
        require(!_exists(tokenId), "Token already exists");
        _mint(to, tokenId);
        emit Attest(to, tokenId);
    }
    
    // Issuer can revoke
    function revoke(address from, uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) == from, "Wrong owner");
        _burn(tokenId);
        emit Revoke(from, tokenId);
    }
    
    // Make transfers impossible
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Cannot transfer soulbound token");
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Cannot transfer soulbound token");
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        revert("Cannot transfer soulbound token");
    }
}
```

---

## Use Cases

### 1. Educational Credentials

```solidity
contract UniversitySBT {
    struct Degree {
        string degree;        // "Bachelor of Science"
        string major;         // "Computer Science"
        uint256 graduationDate;
        string university;    // "MIT"
        uint256 gpa;          // 380 = 3.80
    }
    
    mapping(uint256 => Degree) public degrees;
    
    function issueDegree(
        address student,
        uint256 tokenId,
        string memory degree,
        string memory major,
        uint256 graduationDate,
        uint256 gpa
    ) external onlyUniversity {
        _mint(student, tokenId);
        
        degrees[tokenId] = Degree({
            degree: degree,
            major: major,
            graduationDate: graduationDate,
            university: "MIT",
            gpa: gpa
        });
        
        emit DegreeIssued(student, tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        Degree memory degree = degrees[tokenId];
        
        return buildJSON(
            degree.degree,
            degree.major,
            degree.graduationDate
        );
    }
}
```

### 2. Professional Certifications

```solidity
contract CertificationSBT {
    struct Certification {
        string title;           // "AWS Solutions Architect"
        string issuer;          // "Amazon Web Services"
        uint256 issuedDate;
        uint256 expirationDate;
        string credentialID;    // Reference ID
    }
    
    mapping(uint256 => Certification) public certs;
    
    function issueCertification(
        address professional,
        uint256 tokenId,
        string memory title,
        uint256 expirationDate
    ) external onlyCertifier {
        _mint(professional, tokenId);
        
        certs[tokenId] = Certification({
            title: title,
            issuer: "AWS",
            issuedDate: block.timestamp,
            expirationDate: expirationDate,
            credentialID: generateID()
        });
        
        emit CertificationIssued(professional, tokenId);
    }
    
    function isExpired(uint256 tokenId) public view returns (bool) {
        return block.timestamp > certs[tokenId].expirationDate;
    }
}
```

### 3. Creative Attribution

```solidity
contract ArtistReputationSBT {
    struct ArtistBadge {
        string category;       // "Digital Artist"
        uint256 tier;          // 1-5
        uint256 artworksCount;
        uint256 collectorBase;
    }
    
    mapping(uint256 => ArtistBadge) badges;
    mapping(address => uint256[]) artistBadges;
    
    function issueArtistBadge(
        address artist,
        uint256 tier,
        uint256 artworks
    ) external {
        uint256 tokenId = generateTokenId();
        _mint(artist, tokenId);
        
        badges[tokenId] = ArtistBadge({
            category: "Digital Artist",
            tier: tier,
            artworksCount: artworks,
            collectorBase: 0
        });
        
        artistBadges[artist].push(tokenId);
        emit BadgeIssued(artist, tokenId, tier);
    }
    
    function getBadges(address artist)
        external
        view
        returns (uint256[] memory)
    {
        return artistBadges[artist];
    }
}
```

### 4. Reputation & Governance

```solidity
contract ReputationSBT {
    struct ReputationBadge {
        string level;          // "Contributor", "Reviewer", "Core"
        uint256 score;         // Reputation points
        uint256 contributions;
        bool active;
    }
    
    mapping(uint256 => ReputationBadge) badges;
    
    function issueReputationBadge(
        address member,
        string memory level,
        uint256 score
    ) external onlyDAO {
        uint256 tokenId = nextTokenId++;
        _mint(member, tokenId);
        
        badges[tokenId] = ReputationBadge({
            level: level,
            score: score,
            contributions: 0,
            active: true
        });
        
        emit ReputationEarned(member, tokenId, level);
    }
    
    function updateScore(uint256 tokenId, uint256 newScore)
        external
        onlyDAO
    {
        require(badges[tokenId].active, "Badge inactive");
        badges[tokenId].score = newScore;
        emit ScoreUpdated(tokenId, newScore);
    }
}
```

---

## Advantages

✅ **Permanent Record** - Cannot be lost or stolen  
✅ **Authenticity** - Proves direct achievement  
✅ **Social Proof** - Others verify your credentials  
✅ **Resume** - Wallet becomes resume  
✅ **On-Chain Identity** - Portable across platforms  
✅ **Revocable** - Issuer can revoke if needed  

---

## Disadvantages

❌ **No Secondary Market** - Can't be traded  
❌ **Wallet-Bound** - If wallet compromised, badge stays  
❌ **Lost Forever** - If wallet destroyed, can't recover  
❌ **Privacy Concerns** - All achievements visible  
❌ **Spam Risk** - Issuer could spam SBTs freely  

---

## Advanced Patterns

### Pattern 1: Multi-Tier Progression

```solidity
contract TieredReputationSBT {
    struct Tier {
        string name;
        uint256 minScore;
        uint256 color;  // For UI representation
    }
    
    Tier[5] public tiers;
    
    function upgradeReputation(address user, uint256 newScore)
        external
    {
        uint256 currentTier = getUserTier(user);
        uint256 newTier = getScoreTier(newScore);
        
        if (newTier > currentTier) {
            // Mint new SBT at higher tier
            uint256 tokenId = nextTokenId++;
            _mint(user, tokenId);
            
            emit TierUpgrade(user, currentTier, newTier);
        }
    }
}
```

### Pattern 2: Expiring Credentials

```solidity
contract ExpiringCredentialSBT {
    mapping(uint256 => uint256) expirationTime;
    
    function issueCredential(
        address to,
        uint256 duration  // in seconds
    ) external {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        
        expirationTime[tokenId] = block.timestamp + duration;
    }
    
    function isValid(uint256 tokenId) public view returns (bool) {
        return block.timestamp <= expirationTime[tokenId];
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        require(isValid(tokenId), "Credential expired");
        return buildJSON(tokenId);
    }
}
```

### Pattern 3: Collective SBTs

```solidity
contract CollectiveMembershipSBT {
    mapping(uint256 => string) public memberRoles;
    mapping(address => uint256) public activeMembership;
    
    function joinCommunity(
        address member,
        string memory role
    ) external onlyDAO {
        uint256 tokenId = nextTokenId++;
        _mint(member, tokenId);
        
        memberRoles[tokenId] = role;
        activeMembership[member] = tokenId;
        
        emit MemberJoined(member, tokenId, role);
    }
    
    function hasRole(address member, string memory role)
        public
        view
        returns (bool)
    {
        uint256 tokenId = activeMembership[member];
        if (tokenId == 0) return false;
        
        return keccak256(bytes(memberRoles[tokenId])) ==
               keccak256(bytes(role));
    }
}
```

---

## Real-World Scenarios

### College Digital Diploma

```txt
University Issues SBT to Graduate:
├─ Name: "Bachelor of Science"
├─ Major: "Computer Science"
├─ GPA: "3.85"
├─ Graduation: "May 2024"
└─ Permanent ✓

10 Years Later:
├─ Still in wallet
├─ Still owned by original graduate
├─ Employers can verify
└─ No one can fake it
```

### Open Source Contributor Badge

```txt
GitHub Archive Issues SBT:
├─ Contributor: dev_alice
├─ Status: "Core Maintainer"
├─ Contributions: "450+"
├─ Impact: "Critical"
└─ Issued: 2024

Can Be Used For:
├─ Resume building
├─ Job applications
├─ Community voting
├─ Funding decisions
└─ Networking reputation
```

---

## Practical Considerations

### 1. Wallet Security
```solidity
// Users must secure wallets
// Loss of wallet = loss of credentials
// Consider multi-sig for important SBTs
```

### 2. Revocation Policy
```solidity
// Issuer should establish clear revocation policies
// Appeals process for disputed revocations
// Transparency in issuer decisions
```

### 3. Compatibility
```solidity
// Not all wallets display SBTs well
// May need custom UI/viewers
// Metadata standards important
```

---

## Comparison: SBT vs NFT

| Feature | NFT | SBT |
|---------|-----|-----|
| Transferable | Yes | No |
| Tradeable | Yes | No |
| Use Case | Ownership | Identity |
| Market | Secondary market | No market |
| Purpose | Collectible | Credential |
| Binding | None | Permanent |

---

## Future Use Cases

- **On-Chain Passports** - Digital identity
- **Medical Records** - Health credentials
- **Insurance Proofs** - Coverage documentation
- **Voting Rights** - Community participation
- **Achievement Systems** - Gaming progression

---

## References

- [Soulbound Tokens Whitepaper](https://ethics.harvard.edu/blog/soulbound)
- [ERC-5192 Proposal](https://eips.ethereum.org/EIPS/eip-5192)
- [Practical SBT Implementation](https://github.com/ethereum-attestation-service/)
- [Web3 Identity Primitives](https://ethereum-magicians.org)
