# On-Chain Metadata: Permanent NFT Data

## Overview

On-chain metadata means storing the complete JSON data directly in the smart contract instead of hosting it externally (on IPFS or centralized servers). This ensures permanence, transparency, and immutability.

**Trade-off:** Expensive gas, but permanently secure

---

## Core Concepts

### Traditional Approach
```
Smart Contract
  └─ tokenURI() → "https://server.com/token/123.json"
  
Server
  └─ token/123.json ← Can be modified or deleted
```

### On-Chain Approach
```
Smart Contract
  ├─ tokenURI() → Returns JSON directly
  ├─ Store metadata strings
  ├─ Store attributes
  └─ All immutable forever
```

---

## Advantages

✅ **Permanent** - Cannot be modified or censored
✅ **Transparent** - Verifiable on-chain
✅ **History** - Complete evolution recorded
✅ **Decentralized** - No external dependencies
✅ **Legal Certainty** - Proof of authenticity
✅ **Archive** - Accessible indefinitely

---

## Disadvantages

❌ **Expensive** - String storage costs gas
❌ **Limited Size** - Can't store large files
❌ **Inflexible** - Can't update metadata easily
❌ **Bloated Contracts** - Larger contract size
❌ **Complexity** - More complex implementation

---

## Storage Methods

### 1. Fixed-Size Strings

```solidity
contract OnChainNFT {
    struct Metadata {
        string name;
        string description;
        string image;
        string attributes;
    }
    
    mapping(uint256 => Metadata) public tokenMetadata;
    
    function setMetadata(
        uint256 tokenId,
        string memory name,
        string memory description,
        string memory image,
        string memory attributes
    ) external {
        tokenMetadata[tokenId] = Metadata({
            name: name,
            description: description,
            image: image,
            attributes: attributes
        });
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        Metadata memory meta = tokenMetadata[tokenId];
        
        return string(abi.encodePacked(
            'data:application/json;utf8,{"name":"',
            meta.name,
            '","description":"',
            meta.description,
            '","image":"',
            meta.image,
            '"}'
        ));
    }
}
```

### 2. Encoded Base64 Images

```solidity
import "@openzeppelin/contracts/utils/Base64.sol";

contract SVGOnChainNFT {
    mapping(uint256 => string) public svgData;
    
    function setMetadata(uint256 tokenId, string memory svg) external {
        svgData[tokenId] = svg;
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        string memory svg = svgData[tokenId];
        
        // Encode SVG as data URL
        bytes memory image = abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(bytes(svg))
        );
        
        // Create JSON
        bytes memory json = abi.encodePacked(
            '{"name":"NFT #',
            tokenId,
            '","image":"',
            image,
            '"}'
        );
        
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(json)
        ));
    }
}
```

### 3. Dynamic Composition

```solidity
contract ComposableMetadata {
    struct TraitValue {
        string name;
        string value;
    }
    
    mapping(uint256 => TraitValue[]) public traits;
    
    function addTrait(
        uint256 tokenId,
        string memory traitName,
        string memory traitValue
    ) external {
        traits[tokenId].push(TraitValue({
            name: traitName,
            value: traitValue
        }));
    }
    
    function getMetadata(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        TraitValue[] memory tokenTraits = traits[tokenId];
        
        string memory attributesJson = '[';
        
        for (uint256 i = 0; i < tokenTraits.length; i++) {
            if (i > 0) attributesJson = string(abi.encodePacked(attributesJson, ','));
            
            attributesJson = string(abi.encodePacked(
                attributesJson,
                '{"trait_type":"',
                tokenTraits[i].name,
                '","value":"',
                tokenTraits[i].value,
                '"}'
            ));
        }
        
        attributesJson = string(abi.encodePacked(attributesJson, ']'));
        
        return attributesJson;
    }
}
```

---

## Gas Optimization Strategies

### 1. Batch Setting

```solidity
function batchSetMetadata(
    uint256[] calldata tokenIds,
    Metadata[] calldata metadataArray
) external {
    for (uint256 i = 0; i < tokenIds.length; i++) {
        tokenMetadata[tokenIds[i]] = metadataArray[i];
    }
    // Pay gas once instead of per-token
}
```

### 2. Packed Storage

```solidity
// Use smaller data types where possible
contract PackedMetadata {
    struct Metadata {
        uint8 rarity;        // 0-255
        uint16 power;        // 0-65535
        address creator;     // 20 bytes
        bytes12 color;       // Color code
    }
    
    mapping(uint256 => Metadata) tokens;
    
    // Results in better packing and lower gas
}
```

### 3. SSTORE2 for Large Data

```solidity
// Use SSTORE2 library to store large metadata in separate contracts
import "solmate/utils/SSTORE2.sol";

contract LargeMetadata {
    mapping(uint256 => address) public dataPointers;
    
    function setLargeMetadata(
        uint256 tokenId,
        bytes calldata metadata
    ) external {
        address ptr = SSTORE2.write(metadata);
        dataPointers[tokenId] = ptr;
    }
    
    function getMetadata(uint256 tokenId)
        public
        view
        returns (bytes memory)
    {
        address ptr = dataPointers[tokenId];
        return SSTORE2.read(ptr);
    }
}
```

---

## Real-World Examples

### Example 1: Art NFT with On-Chain Metadata

```json
{
  "name": "Generative Art #001",
  "description": "100% on-chain, fully permanent",
  "image": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCI+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMjAwIiByPSIxOTAiIGZpbGw9IiNmZjAwMDAiLz48L3N2Zz4=",
  "attributes": [
    {"trait_type": "Color", "value": "Red"},
    {"trait_type": "Shape", "value": "Circle"},
    {"trait_type": "Permanence", "value": "Eternal"}
  ]
}
```

### Example 2: Gaming Asset

```solidity
contract GameItem {
    struct GameMetadata {
        string itemName;
        uint256 level;
        uint256 power;
        uint256 rarity;
        string[] abilities;
    }
    
    mapping(uint256 => GameMetadata) items;
    
    function craftItem(
        uint256 tokenId,
        string memory name,
        uint256 level
    ) external {
        emit ItemCrafted(tokenId, name, level);
    }
}
```

---

## Data URI vs Contract Storage

### Data URI Format
```
data:application/json;base64,eyJuYW1lIjoiTkZUIn0=
```

### Advantages
- No external requests needed
- Works offline
- Immutable
- Browser native support

### Implementation

```solidity
function tokenURI(uint256 tokenId)
    public
    view
    override
    returns (string memory)
{
    bytes memory json = abi.encodePacked(
        '{"name":"NFT #',
        Strings.toString(tokenId),
        '","description":"On-chain metadata"}'
    );
    
    return string(abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(json)
    ));
}
```

---

## Best Practices

### 1. Start Small
```solidity
// Begin with simple, essential metadata
// Expand as needed
```

### 2. Validate Input
```solidity
function setMetadata(
    uint256 tokenId,
    string memory data
) external {
    require(bytes(data).length > 0, "Empty metadata");
    require(bytes(data).length <= 1000, "Too large");
    // Set metadata
}
```

### 3. Document Structure
```solidity
/**
 * Metadata Structure:
 * - name: (string) item name
 * - rarity: (uint8) 0-5 scale
 * - power: (uint16) damage/strength
 * - attributes: (string) JSON array
 */
```

### 4. Event Logging
```solidity
event MetadataSet(uint256 indexed tokenId, string metadata);
event MetadataUpdated(uint256 indexed tokenId, string field);
```

---

## Hybrid Approach: Best of Both

```solidity
contract HybridNFT {
    // Static, essential data on-chain
    mapping(uint256 => string) public staticMetadata;
    
    // Dynamic data off-chain
    mapping(uint256 => string) public externalURI;
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        // Use on-chain if available
        if (bytes(staticMetadata[tokenId]).length > 0) {
            return string(abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(bytes(staticMetadata[tokenId]))
            ));
        }
        
        // Fall back to external
        return externalURI[tokenId];
    }
}
```

---

## Migration Path

### Phase 1: Hybrid
- Store essential metadata on-chain
- Large files stay off-chain

### Phase 2: Gradual Migration
- Collect community feedback
- Improve gas efficiency
- Migrate gradually

### Phase 3: Full On-Chain
- All metadata permanent
- Complete decentralization
- Historical immutability

---

## References

- [EIP-891 tokenURI Metadata Standard](https://eips.ethereum.org/EIPS/)
- [Base64 Encoding for Data URIs](https://en.wikipedia.org/wiki/Data_URI_scheme)
- [OpenZeppelin Utilities](https://docs.openzeppelin.com/contracts/4.x/utilities)
