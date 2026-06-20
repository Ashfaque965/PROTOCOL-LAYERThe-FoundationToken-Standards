// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NFT Deployment Templates
 * @dev Ready-to-deploy NFT contracts for different use cases
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * DEPLOYMENT TEMPLATE 1: Simple Art NFT Collection
 * 
 * Use this for:
 * - Digital art
 * - Photography
 * - Collectibles
 * - 1/1 pieces
 */
contract ArtNFTTemplate is ERC721, ERC2981, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    string private baseURI = "https://your-metadata-server.com/art/";
    
    uint96 constant DEFAULT_ROYALTY = 500; // 5%
    
    constructor() ERC721("Art Collection", "ART") {
        _setDefaultRoyalty(msg.sender, DEFAULT_ROYALTY);
    }
    
    function mint() external onlyOwner returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _mint(msg.sender, tokenId);
        return tokenId;
    }
    
    function setBaseURI(string memory newURI) external onlyOwner {
        baseURI = newURI;
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId)));
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

/**
 * DEPLOYMENT TEMPLATE 2: Gaming Assets Collection
 * 
 * Use this for:
 * - In-game items
 * - Weapons, armor, skins
 * - Multiple item types
 * - Gaming ecosystem
 */
contract GamingAssetsTemplate is ERC1155, Ownable {
    
    // Item type IDs
    uint256 constant GOLD = 1;
    uint256 constant SILVER = 2;
    uint256 constant SWORD = 100;
    uint256 constant SHIELD = 101;
    
    string public name = "Gaming Assets";
    string public symbol = "GAME";
    
    mapping(uint256 => string) private tokenURIs;
    
    constructor(string memory baseURI) ERC1155(baseURI) {}
    
    function mintFungible(address to, uint256 amount) external onlyOwner {
        _mint(to, GOLD, amount, "");
    }
    
    function mintNonFungible(address to) external onlyOwner {
        _mint(to, SWORD, 1, "");
    }
    
    function batchMint(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }
    
    function setURI(uint256 id, string memory newURI) external onlyOwner {
        tokenURIs[id] = newURI;
        emit URI(newURI, id);
    }
}

/**
 * DEPLOYMENT TEMPLATE 3: Limited Edition Collection
 * 
 * Use this for:
 * - Drops and releases
 * - Limited supply NFTs
 * - Paid minting
 * - Public sales
 */
contract LimitedEditionTemplate is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    uint256 constant MAX_SUPPLY = 100;
    uint256 constant MINT_PRICE = 0.1 ether;
    
    string private baseURI;
    bool public saleActive = false;
    
    constructor(string memory _baseURI) ERC721("Limited Edition", "LTED") {
        baseURI = _baseURI;
    }
    
    function toggleSale() external onlyOwner {
        saleActive = !saleActive;
    }
    
    function mint() external payable returns (uint256) {
        require(saleActive, "Sale not active");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(tokenIdCounter.current() < MAX_SUPPLY, "Supply exhausted");
        
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(msg.sender, tokenId);
        return tokenId;
    }
    
    function ownerMint(address to) external onlyOwner returns (uint256) {
        require(tokenIdCounter.current() < MAX_SUPPLY, "Supply exhausted");
        
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(to, tokenId);
        return tokenId;
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId)));
    }
}

/**
 * DEPLOYMENT TEMPLATE 4: Dynamic Profile NFT
 * 
 * Use this for:
 * - Gaming characters
 * - Evolving avatars
 * - Achievement systems
 * - Progression mechanics
 */
contract DynamicProfileTemplate is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    struct Profile {
        string name;
        uint32 level;
        uint32 points;
        uint64 createdAt;
    }
    
    mapping(uint256 => Profile) public profiles;
    
    constructor() ERC721("Dynamic Profiles", "DPROF") {}
    
    function createProfile(string memory name) external returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(msg.sender, tokenId);
        profiles[tokenId] = Profile(name, 1, 0, uint64(block.timestamp));
        
        return tokenId;
    }
    
    function addPoints(uint256 tokenId, uint32 points) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        
        profiles[tokenId].points += points;
        
        // Auto-level up
        uint32 newLevel = 1 + profiles[tokenId].points / 100;
        if (newLevel > profiles[tokenId].level) {
            profiles[tokenId].level = newLevel;
        }
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        
        Profile memory profile = profiles[tokenId];
        
        string memory json = string(abi.encodePacked(
            '{"name":"',
            profile.name,
            '","level":',
            Strings.toString(uint256(profile.level)),
            ',"points":',
            Strings.toString(uint256(profile.points)),
            '}'
        ));
        
        return string(abi.encodePacked(
            'data:application/json;utf8,',
            json
        ));
    }
}

/**
 * DEPLOYMENT TEMPLATE 5: Credential/Achievement NFT
 * 
 * Use this for:
 * - Certificates
 * - Achievements
 * - Badges
 * - Credentials
 */
contract CredentialTemplate is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    struct Credential {
        string title;
        uint256 issuedDate;
        uint256 expirationDate;
    }
    
    mapping(uint256 => Credential) public credentials;
    
    event CredentialIssued(address indexed to, uint256 indexed tokenId, string title);
    
    constructor() ERC721("Credentials", "CRED") {}
    
    function issueCredential(
        address to,
        string memory title,
        uint256 duration
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(to, tokenId);
        credentials[tokenId] = Credential(
            title,
            block.timestamp,
            block.timestamp + duration * 1 days
        );
        
        emit CredentialIssued(to, tokenId, title);
        return tokenId;
    }
    
    function isValid(uint256 tokenId) public view returns (bool) {
        return block.timestamp <= credentials[tokenId].expirationDate;
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        
        Credential memory cred = credentials[tokenId];
        string memory status = isValid(tokenId) ? "Valid" : "Expired";
        
        string memory json = string(abi.encodePacked(
            '{"title":"',
            cred.title,
            '","status":"',
            status,
            '"}'
        ));
        
        return string(abi.encodePacked(
            'data:application/json;utf8,',
            json
        ));
    }
}
