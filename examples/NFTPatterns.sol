// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NFT Usage Examples
 * @dev Common patterns and best practices for NFT implementations
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Example 1: NFT with Approval Workflow
 */
contract NFTApprovalExample is ERC721, Ownable {
    
    uint256 private tokenIdCounter = 1;
    
    constructor() ERC721("Approval NFT", "ANFT") {}
    
    function mint() external returns (uint256) {
        uint256 tokenId = tokenIdCounter++;
        _mint(msg.sender, tokenId);
        return tokenId;
    }
    
    // Owner must approve marketplace before transfer
    function listOnMarketplace(uint256 tokenId, address marketplace) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        approve(marketplace, tokenId);
    }
}

/**
 * Example 2: Whitelist Minting
 */
contract WhitelistNFT is ERC721, Ownable {
    
    mapping(address => bool) public whitelist;
    uint256 private tokenIdCounter = 1;
    
    constructor() ERC721("Whitelist NFT", "WNFT") {}
    
    function addToWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
        }
    }
    
    function mint() external returns (uint256) {
        require(whitelist[msg.sender], "Not whitelisted");
        
        uint256 tokenId = tokenIdCounter++;
        _mint(msg.sender, tokenId);
        return tokenId;
    }
}

/**
 * Example 3: Limited Supply NFT
 */
contract LimitedSupplyNFT is ERC721, Ownable {
    
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant PRICE = 0.1 ether;
    
    uint256 private tokenIdCounter = 1;
    string private baseURI;
    
    constructor() ERC721("Limited NFT", "LNFT") {}
    
    function mint(uint256 quantity) external payable {
        require(
            tokenIdCounter + quantity - 1 <= MAX_SUPPLY,
            "Exceeds max supply"
        );
        require(msg.value >= quantity * PRICE, "Insufficient payment");
        
        for (uint256 i = 0; i < quantity; i++) {
            _mint(msg.sender, tokenIdCounter++);
        }
    }
    
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

/**
 * Example 4: Pausable NFT (Emergency Stop)
 */
contract PausableNFT is ERC721, Ownable {
    
    bool public paused;
    uint256 private tokenIdCounter = 1;
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    constructor() ERC721("Pausable NFT", "PNFT") {}
    
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    function mint() external whenNotPaused returns (uint256) {
        uint256 tokenId = tokenIdCounter++;
        _mint(msg.sender, tokenId);
        return tokenId;
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(!paused || from == address(0), "Transfers paused");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}

/**
 * Example 5: Burnable NFT
 */
contract BurnableNFT is ERC721, Ownable {
    
    uint256 private tokenIdCounter = 1;
    
    event Burned(uint256 indexed tokenId);
    
    constructor() ERC721("Burnable NFT", "BNFT") {}
    
    function mint() external returns (uint256) {
        uint256 tokenId = tokenIdCounter++;
        _mint(msg.sender, tokenId);
        return tokenId;
    }
    
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _burn(tokenId);
        emit Burned(tokenId);
    }
}

/**
 * Example 6: NFT Tournament (Time-Limited Trading)
 */
contract TournamentNFT is ERC721, Ownable {
    
    uint256 public tournamentStart;
    uint256 public tournamentEnd;
    uint256 private tokenIdCounter = 1;
    
    modifier onlyDuringTournament() {
        require(
            block.timestamp >= tournamentStart &&
            block.timestamp <= tournamentEnd,
            "Tournament not active"
        );
        _;
    }
    
    constructor() ERC721("Tournament NFT", "TNFT") {}
    
    function setTournament(uint256 start, uint256 end) external onlyOwner {
        tournamentStart = start;
        tournamentEnd = end;
    }
    
    function mint() external returns (uint256) {
        uint256 tokenId = tokenIdCounter++;
        _mint(msg.sender, tokenId);
        return tokenId;
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        // Allow transfers only during tournament, or for minting/burning
        if (from != address(0) && to != address(0)) {
            require(block.timestamp < tournamentStart || block.timestamp > tournamentEnd, "Transfers locked");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
