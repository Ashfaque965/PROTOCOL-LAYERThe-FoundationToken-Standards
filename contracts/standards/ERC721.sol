// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC-721 NFT Standard Implementation
 * @dev Complete ERC-721 implementation with minting and metadata
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    string private baseURI;
    
    event MetadataUpdated(uint256 indexed tokenId, string newURI);
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        baseURI = _baseURI;
    }
    
    /**
     * @dev Mint a new NFT
     */
    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(to, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs
     */
    function batchMint(address to, uint256 quantity) external onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = tokenIdCounter.current();
            tokenIdCounter.increment();
            _mint(to, tokenId);
        }
    }
    
    /**
     * @dev Get metadata URI for token
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        
        return string(abi.encodePacked(
            baseURI,
            Strings.toString(tokenId),
            ".json"
        ));
    }
    
    /**
     * @dev Update base URI
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }
    
    /**
     * @dev Burn a token (optional)
     */
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _burn(tokenId);
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return tokenIdCounter.current();
    }
}
