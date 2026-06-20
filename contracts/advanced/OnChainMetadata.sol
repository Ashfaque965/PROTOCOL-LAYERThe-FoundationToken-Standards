// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title On-Chain Metadata NFT
 * @dev 100% on-chain metadata stored directly in contract
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract OnChainMetadataNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private tokenIdCounter;
    
    struct Metadata {
        string name;
        string description;
        string imageData;  // SVG or base64
        string attributes;  // JSON string
        string color;
        uint256 rarity;    // 1-5
    }
    
    mapping(uint256 => Metadata) public tokenMetadata;
    
    event MetadataSet(uint256 indexed tokenId, string name);
    event MetadataUpdated(uint256 indexed tokenId);
    
    constructor() ERC721("On-Chain NFT", "OCNFT") {}
    
    /**
     * @dev Mint NFT with on-chain metadata
     */
    function mint(
        string memory name,
        string memory description,
        string memory imageData,
        string memory attributes,
        string memory color,
        uint256 rarity
    ) external returns (uint256) {
        require(rarity >= 1 && rarity <= 5, "Invalid rarity");
        
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(msg.sender, tokenId);
        
        tokenMetadata[tokenId] = Metadata({
            name: name,
            description: description,
            imageData: imageData,
            attributes: attributes,
            color: color,
            rarity: rarity
        });
        
        emit MetadataSet(tokenId, name);
        
        return tokenId;
    }
    
    /**
     * @dev Update metadata for a token
     */
    function updateMetadata(
        uint256 tokenId,
        string memory description,
        uint256 rarity
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(_exists(tokenId), "Token doesn't exist");
        
        Metadata storage meta = tokenMetadata[tokenId];
        meta.description = description;
        meta.rarity = rarity;
        
        emit MetadataUpdated(tokenId);
    }
    
    /**
     * @dev Get rarity as string
     */
    function getRarityString(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rarity = tokenMetadata[tokenId].rarity;
        
        if (rarity == 5) return "Legendary";
        if (rarity == 4) return "Epic";
        if (rarity == 3) return "Rare";
        if (rarity == 2) return "Uncommon";
        return "Common";
    }
    
    /**
     * @dev Generate complete metadata URI with on-chain data
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        
        Metadata memory meta = tokenMetadata[tokenId];
        
        // Build JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name":"',
            meta.name,
            '","description":"',
            meta.description,
            '","image":"data:image/svg+xml;base64,',
            Base64.encode(bytes(meta.imageData)),
            '","attributes":[',
            '{"trait_type":"Color","value":"',
            meta.color,
            '"},',
            '{"trait_type":"Rarity","value":"',
            getRarityString(tokenId),
            '"},',
            meta.attributes,
            ']}'
        ));
        
        // Return as data URI
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(json))
        ));
    }
    
    /**
     * @dev SVG example generator
     */
    function generateSimpleSVG(
        uint256 tokenId,
        string memory color
    ) external pure returns (string memory) {
        return string(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="400" height="400" fill="',
            color,
            '"/>',
            '<text x="200" y="200" font-size="32" text-anchor="middle" fill="white">',
            'NFT #',
            tokenId.toString(),
            '</text>',
            '</svg>'
        ));
    }
    
    /**
     * @dev Batch mint multiple on-chain NFTs
     */
    function batchMint(
        string[] calldata names,
        string[] calldata descriptions,
        string[] calldata colors
    ) external {
        require(
            names.length == descriptions.length &&
            descriptions.length == colors.length,
            "Array length mismatch"
        );
        
        for (uint256 i = 0; i < names.length; i++) {
            mint(
                names[i],
                descriptions[i],
                generateSimpleSVG(tokenIdCounter.current(), colors[i]),
                '{"trait_type":"Index","value":"' + i.toString() + '"}',
                colors[i],
                1
            );
        }
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return tokenIdCounter.current();
    }
}
