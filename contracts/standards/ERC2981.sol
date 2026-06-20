// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC-2981 Royalty Standard Implementation
 * @dev Enables automatic royalty payments on secondary sales
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RoyaltyNFT is ERC721, ERC2981, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    string private baseURI;
    
    // Configuration
    address public royaltyReceiver;
    uint96 public royaltyPercentage; // in basis points (500 = 5%)
    
    event RoyaltyUpdated(address indexed receiver, uint96 percentage);
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyReceiver,
        uint96 _royaltyPercentage
    ) ERC721(_name, _symbol) {
        royaltyReceiver = _royaltyReceiver;
        royaltyPercentage = _royaltyPercentage;
        
        // Set default royalty for all tokens
        _setDefaultRoyalty(_royaltyReceiver, _royaltyPercentage);
    }
    
    /**
     * @dev Mint NFT with royalty settings
     */
    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(to, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev Set royalty for specific token
     */
    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 royaltyPercentage
    ) external onlyOwner {
        require(_exists(tokenId), "Token doesn't exist");
        require(royaltyPercentage <= 10000, "Royalty too high"); // Max 100%
        
        _setTokenRoyalty(tokenId, receiver, royaltyPercentage);
    }
    
    /**
     * @dev Update default royalty for all tokens
     */
    function setDefaultRoyalty(
        address receiver,
        uint96 royaltyPercentage
    ) external onlyOwner {
        require(royaltyPercentage <= 10000, "Royalty too high");
        
        royaltyReceiver = receiver;
        royaltyPercentage = royaltyPercentage;
        
        _setDefaultRoyalty(receiver, royaltyPercentage);
        emit RoyaltyUpdated(receiver, royaltyPercentage);
    }
    
    /**
     * @dev Get royalty information for a token
     * Called by marketplaces to calculate royalty payments
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        public
        view
        override(ERC2981)
        returns (address receiver, uint256 royaltyAmount)
    {
        return super.royaltyInfo(tokenId, salePrice);
    }
    
    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }
    
    /**
     * @dev Get token URI with metadata
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
     * @dev Support interface detection
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
