// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Soulbound Token (Non-Transferable NFT)
 * @dev Non-transferable tokens for identity, credentials, and reputation
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SoulboundToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    struct Credential {
        string title;
        string issuer;
        uint256 issuedDate;
        uint256 expirationDate;
        bool isActive;
    }
    
    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) public userCredentials;
    
    event CredentialIssued(
        address indexed to,
        uint256 indexed tokenId,
        string title
    );
    
    event CredentialRevoked(
        address indexed from,
        uint256 indexed tokenId
    );
    
    constructor() ERC721("Soulbound Token", "SBT") {}
    
    /**
     * @dev Issue a soulbound token to an address
     * Only owner (issuer) can call this
     */
    function issueCredential(
        address to,
        string memory title,
        uint256 expirationDate
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid address");
        
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(to, tokenId);
        
        credentials[tokenId] = Credential({
            title: title,
            issuer: "Issuer",
            issuedDate: block.timestamp,
            expirationDate: expirationDate,
            isActive: true
        });
        
        userCredentials[to].push(tokenId);
        
        emit CredentialIssued(to, tokenId, title);
        
        return tokenId;
    }
    
    /**
     * @dev Batch issue credentials
     */
    function batchIssueCredentials(
        address[] calldata recipients,
        string memory title,
        uint256 expirationDate
    ) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            issueCredential(recipients[i], title, expirationDate);
        }
    }
    
    /**
     * @dev Revoke a credential
     */
    function revokeCredential(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token doesn't exist");
        
        address from = ownerOf(tokenId);
        credentials[tokenId].isActive = false;
        
        _burn(tokenId);
        
        emit CredentialRevoked(from, tokenId);
    }
    
    /**
     * @dev Check if credential is valid (not expired)
     */
    function isCredentialValid(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token doesn't exist");
        
        Credential memory cred = credentials[tokenId];
        return cred.isActive && block.timestamp <= cred.expirationDate;
    }
    
    /**
     * @dev Get all credentials for an address
     */
    function getCredentials(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userCredentials[user];
    }
    
    /**
     * @dev Get valid credentials for an address
     */
    function getValidCredentials(address user)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory userCreds = userCredentials[user];
        uint256[] memory validCreds = new uint256[](userCreds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < userCreds.length; i++) {
            if (isCredentialValid(userCreds[i])) {
                validCreds[count] = userCreds[i];
                count++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = validCreds[i];
        }
        
        return result;
    }
    
    /**
     * @dev Prevent transfers by overriding transfer functions
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        // Allow minting (from == address(0)) and burning (to == address(0))
        require(
            from == address(0) || to == address(0),
            "Soulbound tokens are non-transferable"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Override transferFrom to prevent transfers
     */
    function transferFrom(address, address, uint256)
        public
        override
    {
        revert("Soulbound tokens cannot be transferred");
    }
    
    /**
     * @dev Override safeTransferFrom to prevent transfers
     */
    function safeTransferFrom(
        address,
        address,
        uint256
    ) public override {
        revert("Soulbound tokens cannot be transferred");
    }
    
    /**
     * @dev Override safeTransferFrom to prevent transfers
     */
    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public override {
        revert("Soulbound tokens cannot be transferred");
    }
    
    /**
     * @dev Get token metadata
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token doesn't exist");
        
        Credential memory cred = credentials[tokenId];
        
        string memory status = isCredentialValid(tokenId) ? "Valid" : "Expired";
        
        return string(abi.encodePacked(
            '{"name":"',
            cred.title,
            '","description":"Soulbound Credential","attributes":[',
            '{"trait_type":"Status","value":"',
            status,
            '"},',
            '{"trait_type":"Issuer","value":"',
            cred.issuer,
            '"}',
            ']}'
        ));
    }
}
