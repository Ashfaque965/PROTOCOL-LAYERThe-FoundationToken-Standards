// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Dynamic NFT Implementation
 * @dev NFT metadata changes based on game stats, time, or oracle data
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract DynamicNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private tokenIdCounter;
    
    struct Character {
        string name;
        uint32 level;
        uint32 experience;
        uint32 health;
        uint32 power;
        uint64 createdAt;
        bool isAlive;
    }
    
    mapping(uint256 => Character) public characters;
    
    event CharacterCreated(uint256 indexed tokenId, string name);
    event CharacterLeveledUp(uint256 indexed tokenId, uint32 newLevel);
    event CharacterDamaged(uint256 indexed tokenId, uint32 damage);
    event CharacterDied(uint256 indexed tokenId);
    
    constructor() ERC721("Dynamic NFT", "DNFT") {}
    
    /**
     * @dev Create a new character
     */
    function createCharacter(string memory name) external returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(msg.sender, tokenId);
        
        characters[tokenId] = Character({
            name: name,
            level: 1,
            experience: 0,
            health: 100,
            power: 10,
            createdAt: uint64(block.timestamp),
            isAlive: true
        });
        
        emit CharacterCreated(tokenId, name);
        
        return tokenId;
    }
    
    /**
     * @dev Gain experience and level up
     */
    function gainExperience(uint256 tokenId, uint32 amount) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(characters[tokenId].isAlive, "Character dead");
        
        Character storage char = characters[tokenId];
        char.experience += amount;
        
        // Level up every 1000 experience
        uint32 newLevel = char.experience / 1000;
        if (newLevel > char.level) {
            char.level = newLevel;
            char.power = newLevel * 10;
            
            emit CharacterLeveledUp(tokenId, newLevel);
        }
    }
    
    /**
     * @dev Take damage
     */
    function takeDamage(uint256 tokenId, uint32 damage) external {
        Character storage char = characters[tokenId];
        require(char.isAlive, "Already dead");
        
        if (damage >= char.health) {
            char.health = 0;
            char.isAlive = false;
            emit CharacterDied(tokenId);
        } else {
            char.health -= damage;
            emit CharacterDamaged(tokenId, damage);
        }
    }
    
    /**
     * @dev Heal character
     */
    function heal(uint256 tokenId, uint32 amount) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        
        Character storage char = characters[tokenId];
        char.health = uint32(uint256(char.health) + amount > 100 ? 100 : char.health + amount);
    }
    
    /**
     * @dev Get character age in days
     */
    function getCharacterAge(uint256 tokenId) public view returns (uint256) {
        return (block.timestamp - characters[tokenId].createdAt) / 1 days;
    }
    
    /**
     * @dev Get rarity based on level
     */
    function getRarity(uint256 tokenId) public view returns (string memory) {
        uint32 level = characters[tokenId].level;
        
        if (level >= 50) return "Legendary";
        if (level >= 30) return "Epic";
        if (level >= 15) return "Rare";
        if (level >= 5) return "Uncommon";
        return "Common";
    }
    
    /**
     * @dev Get status based on health
     */
    function getStatus(uint256 tokenId) public view returns (string memory) {
        Character memory char = characters[tokenId];
        
        if (!char.isAlive) return "Deceased";
        if (char.health < 20) return "Critical";
        if (char.health < 50) return "Injured";
        return "Healthy";
    }
    
    /**
     * @dev Generate full metadata as JSON
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        
        Character memory char = characters[tokenId];
        
        string memory metadata = string(abi.encodePacked(
            '{"name":"',
            char.name,
            ' #',
            tokenId.toString(),
            '","description":"A dynamic evolving character","attributes":[',
            '{"trait_type":"Level","value":',
            uint256(char.level).toString(),
            '},',
            '{"trait_type":"Experience","value":',
            uint256(char.experience).toString(),
            '},',
            '{"trait_type":"Health","value":',
            uint256(char.health).toString(),
            '},',
            '{"trait_type":"Power","value":',
            uint256(char.power).toString(),
            '},',
            '{"trait_type":"Rarity","value":"',
            getRarity(tokenId),
            '"},',
            '{"trait_type":"Status","value":"',
            getStatus(tokenId),
            '"},',
            '{"trait_type":"Age (days)","value":',
            getCharacterAge(tokenId).toString(),
            '}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(metadata))
        ));
    }
}
