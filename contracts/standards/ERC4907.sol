// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC-4907 Rental NFT Standard Implementation
 * @dev Enables NFT rental with separate owner and user roles
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IERC4907 {
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);
    
    function setUser(uint256 tokenId, address user, uint64 expires) external;
    function userOf(uint256 tokenId) external view returns (address);
    function userExpires(uint256 tokenId) external view returns (uint256);
}

contract RentalNFT is ERC721, IERC4907, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    struct UserInfo {
        address user;
        uint64 expires;
    }
    
    mapping(uint256 => UserInfo) internal userInfo;
    string private baseURI;
    
    constructor(
        string memory name,
        string memory symbol,
        string memory _baseURI
    ) ERC721(name, symbol) {
        baseURI = _baseURI;
    }
    
    /**
     * @dev Mint a new rental NFT
     */
    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(to, tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev Set user for NFT rental
     * Only owner can set a user
     */
    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public override {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(expires > block.number, "Invalid expiration");
        
        UserInfo storage info = userInfo[tokenId];
        info.user = user;
        info.expires = expires;
        
        emit UpdateUser(tokenId, user, expires);
    }
    
    /**
     * @dev Get user address for token
     * Returns address(0) if expired
     */
    function userOf(uint256 tokenId)
        public
        view
        override
        returns (address)
    {
        if (uint64(block.number) >= userInfo[tokenId].expires) {
            return address(0);
        }
        return userInfo[tokenId].user;
    }
    
    /**
     * @dev Get expiration block for user rights
     */
    function userExpires(uint256 tokenId)
        public
        view
        override
        returns (uint256)
    {
        return userInfo[tokenId].expires;
    }
    
    /**
     * @dev Calculate days remaining for rental
     */
    function daysRemaining(uint256 tokenId)
        public
        view
        returns (uint256)
    {
        uint64 expires = userInfo[tokenId].expires;
        if (uint64(block.number) >= expires) {
            return 0;
        }
        
        // Assuming ~7200 blocks per day on Ethereum
        return (expires - uint64(block.number)) / 7200;
    }
    
    /**
     * @dev Clear user before transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Clear user on transfer
        if (from != to && from != address(0)) {
            delete userInfo[tokenId];
        }
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
     * @dev Set base URI
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }
}
