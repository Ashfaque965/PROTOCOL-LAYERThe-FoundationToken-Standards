# Dynamic NFTs: Evolution & Change

## Overview

Dynamic NFTs update their metadata based on external events, internal logic, or time progression. Unlike static NFTs, their properties change and evolve, creating living, responsive assets.

**Key Feature:** NFT data changes = contract state changes

---

## Core Concepts

### Static NFT
```
NFT Created → Metadata Set → Never Changes → Static Forever
```

### Dynamic NFT
```
NFT Created → Initial Metadata
    ↓
External Event → Metadata Changes
    ↓
Time Passes → Metadata Evolves
    ↓
Player Action → Metadata Responds
```

---

## Change Triggers

### 1. Oracle Data Integration

```solidity
contract OraclePricedNFT {
    AggregatorV3Interface priceOracle;
    
    struct NFTData {
        string name;
        uint256 rarity;
        int256 currentPrice;
    }
    
    mapping(uint256 => NFTData) nftData;
    
    function updateFromOracle(uint256 tokenId) external {
        (, int256 price, , , ) = priceOracle.latestRoundData();
        
        nftData[tokenId].currentPrice = price;
        
        // Rarity changes based on price
        if (price > 50000e8) {
            nftData[tokenId].rarity = 5; // Legendary
        } else if (price > 30000e8) {
            nftData[tokenId].rarity = 4; // Epic
        } else {
            nftData[tokenId].rarity = 3; // Rare
        }
        
        emit MetadataUpdated(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        NFTData memory data = nftData[tokenId];
        
        // Return dynamic metadata
        return buildJSON(data);
    }
}
```

### 2. Game Stats Evolution

```solidity
contract GameCharacterNFT {
    struct Character {
        uint32 level;
        uint32 experience;
        uint32 health;
        uint32 power;
        bool isAlive;
    }
    
    mapping(uint256 => Character) characters;
    
    function gainExperience(uint256 tokenId, uint32 amount) external {
        require(canAct(tokenId), "Cannot act");
        
        Character storage char = characters[tokenId];
        char.experience += amount;
        
        // Level up
        uint32 newLevel = char.experience / 1000;
        if (newLevel > char.level) {
            char.level = newLevel;
            char.power = newLevel * 10;
            
            emit CharacterLeveledUp(tokenId, newLevel);
        }
    }
    
    function takeDamage(uint256 tokenId, uint32 damage) external {
        Character storage char = characters[tokenId];
        
        if (damage >= char.health) {
            char.health = 0;
            char.isAlive = false;
            emit CharacterDied(tokenId);
        } else {
            char.health -= damage;
            emit CharacterDamaged(tokenId, damage);
        }
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        Character memory char = characters[tokenId];
        
        // Metadata changes based on character state
        string memory status = char.isAlive ? "Living" : "Deceased";
        string memory rarity = char.level >= 50 ? "Legendary" : "Epic";
        
        return buildCharacterJSON(char, status, rarity);
    }
}
```

### 3. Time-Based Evolution

```solidity
contract EvolvingNFT {
    struct Evolution {
        uint256 stage;
        uint256 createdAt;
        uint256 lastEvolution;
    }
    
    mapping(uint256 => Evolution) evolutions;
    
    function checkEvolution(uint256 tokenId) external {
        Evolution storage evo = evolutions[tokenId];
        
        uint256 ageInDays = (block.timestamp - evo.createdAt) / 1 days;
        
        // Evolve based on age
        if (ageInDays >= 30 && evo.stage == 1) {
            evo.stage = 2;
            evo.lastEvolution = block.timestamp;
            emit Evolved(tokenId, 2);
        } else if (ageInDays >= 90 && evo.stage == 2) {
            evo.stage = 3;
            evo.lastEvolution = block.timestamp;
            emit Evolved(tokenId, 3);
        }
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        Evolution memory evo = evolutions[tokenId];
        
        string[4] memory stageNames = ["", "Egg", "Chicken", "Phoenix"];
        string memory stage = stageNames[evo.stage];
        
        return buildJSON(stage, evo.stage);
    }
}
```

### 4. AI Logic Integration

```solidity
contract AIControlledNFT {
    
    struct AIState {
        uint256 mood;        // 0-100
        uint256 energy;      // 0-100
        uint256 hunger;      // 0-100
        uint256 happiness;   // 0-100
        uint256 lastUpdated;
    }
    
    mapping(uint256 => AIState) aiStates;
    
    function updateAIState(uint256 tokenId) external {
        AIState storage state = aiStates[tokenId];
        
        uint256 timeElapsed = block.timestamp - state.lastUpdated;
        
        // AI degrades naturally
        state.energy = state.energy > (timeElapsed / 1 hours) ? 
            state.energy - (timeElapsed / 1 hours) : 0;
        state.hunger = state.hunger + (timeElapsed / 2 hours);
        
        // Calculate mood based on stats
        state.mood = (state.happiness + state.energy) / 2;
        
        state.lastUpdated = block.timestamp;
        emit AIStateUpdated(tokenId);
    }
    
    function feed(uint256 tokenId) external {
        AIState storage state = aiStates[tokenId];
        require(state.hunger > 0, "Not hungry");
        
        state.hunger = 0;
        state.happiness = min(state.happiness + 20, 100);
        
        emit Fed(tokenId);
    }
    
    function play(uint256 tokenId) external {
        AIState storage state = aiStates[tokenId];
        require(state.energy >= 20, "Too tired");
        
        state.energy -= 20;
        state.happiness = min(state.happiness + 30, 100);
        state.hunger += 10;
        
        emit Played(tokenId);
    }
}
```

---

## Data Update Patterns

### Pattern 1: Time-Locked Updates

```solidity
mapping(uint256 => uint256) lastUpdateTime;

function updateMetadata(uint256 tokenId) external {
    require(
        block.timestamp >= lastUpdateTime[tokenId] + 1 days,
        "Wait 24 hours"
    );
    
    // Update logic
    lastUpdateTime[tokenId] = block.timestamp;
}
```

### Pattern 2: Queued Updates

```solidity
struct UpdateRequest {
    uint256 tokenId;
    uint256 requestTime;
    bool pending;
}

mapping(bytes32 => UpdateRequest) updateRequests;

function requestUpdate(uint256 tokenId) external {
    bytes32 requestId = keccak256(abi.encode(tokenId, msg.sender));
    updateRequests[requestId] = UpdateRequest({
        tokenId: tokenId,
        requestTime: block.timestamp,
        pending: true
    });
}

function executeUpdate(bytes32 requestId) external {
    UpdateRequest storage request = updateRequests[requestId];
    require(request.pending, "Not pending");
    require(
        block.timestamp >= request.requestTime + 1 hours,
        "Too soon"
    );
    
    // Execute update
    request.pending = false;
}
```

### Pattern 3: Weighted Random Changes

```solidity
function randomMetadataChange(uint256 tokenId) external returns (uint256) {
    uint256 random = uint256(
        keccak256(abi.encodePacked(block.timestamp, block.difficulty))
    ) % 100;
    
    Metadata storage meta = metadata[tokenId];
    
    if (random < 30) {
        // 30% chance: Increase rarity
        meta.rarity = min(meta.rarity + 1, 5);
    } else if (random < 60) {
        // 30% chance: Increase power
        meta.power += 5;
    } else if (random < 85) {
        // 25% chance: Change color
        meta.color = getRandomColor(random);
    }
    // 15% chance: No change
    
    return random;
}
```

---

## Real-World Scenarios

### Gaming Evolution Path

```txt
Stage 1: Common Item
├─ Power: 10
├─ Level: 1
└─ Color: Gray

↓ After 10 battles

Stage 2: Rare Item
├─ Power: 25
├─ Level: 5
├─ Color: Blue
└─ Special Ability: Unlocked

↓ After 50 battles

Stage 3: Epic Item
├─ Power: 50
├─ Level: 15
├─ Color: Purple
├─ Special Ability: Enhanced
└─ Prestige: Gained

↓ After 100 battles

Stage 4: Legendary Item
├─ Power: 100
├─ Level: 50
├─ Color: Gold
├─ Special Ability: Evolved
├─ Aura: Active
└─ Attribute: Ascended
```

### Creature Evolution

```javascript
// On-chain creature that evolves
const creature = {
  stage: "Egg",        // Week 1
  hunger: 100,
  happiness: 50,
  
  // After caring for 1 week
  stage: "Hatchling",  // Week 2-4
  hunger: 75,
  happiness: 80,
  
  // After caring for 1 month
  stage: "Juvenile",   // Week 5-12
  hunger: 50,
  happiness: 90,
  
  // After 3 months of growth
  stage: "Adult",      // Permanent
  hunger: 25,
  happiness: 95,
  power: 100
};
```

---

## Event Emission

```solidity
event MetadataUpdated(
    uint256 indexed tokenId,
    string oldValue,
    string newValue,
    uint256 timestamp
);

event StatChanged(
    uint256 indexed tokenId,
    string statName,
    uint256 oldValue,
    uint256 newValue
);

event RarityUpgraded(
    uint256 indexed tokenId,
    uint256 newRarity
);
```

---

## Gas Optimization

### Batch Updates

```solidity
function batchUpdate(uint256[] calldata tokenIds) external {
    for (uint256 i = 0; i < tokenIds.length; i++) {
        updateToken(tokenIds[i]);
    }
}
```

### Lazy Evaluation

```solidity
function tokenURI(uint256 tokenId)
    public
    view
    returns (string memory)
{
    // Calculate current traits on-the-fly
    // Don't store if not queried
    
    uint256 timeSinceCreation = block.timestamp - createdAt[tokenId];
    uint256 currentLevel = 1 + (timeSinceCreation / 1 days);
    
    return buildMetadata(tokenId, currentLevel);
}
```

---

## Security Considerations

1. **Update Authorization** - Only owner/game can update
2. **Manipulation Prevention** - Prevent stat inflation
3. **Fair Randomness** - Use Chainlink VRF for true randomness
4. **Rate Limiting** - Prevent rapid updates/exploits
5. **Data Validation** - Verify new states are valid

---

## References

- [Dynamic NFT Standards](https://www.chainlink.com/use-cases/dynamic-nft)
- [Chainlink Integration](https://docs.chain.link/)
- [ERC-725 Dynamic Identity](https://eips.ethereum.org/EIPS/eip-725)
