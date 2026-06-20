// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC-1155 Multi-Token Standard Implementation
 * @dev Supports both fungible and non-fungible tokens in single contract
 */

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiToken is ERC1155, Ownable {
    
    // Token type definitions
    uint256 public constant GOLD_TOKEN = 1;
    uint256 public constant SILVER_TOKEN = 2;
    uint256 public constant LEGENDARY_SWORD = 100;
    uint256 public constant COMMON_SHIELD = 101;
    
    string public name = "Multi Token";
    string public symbol = "MTK";
    
    mapping(uint256 => string) private tokenURIs;
    
    event TokenMinted(address indexed to, uint256 indexed id, uint256 amount);
    event TokenBurned(address indexed from, uint256 indexed id, uint256 amount);
    
    constructor(string memory baseURI) ERC1155(baseURI) {}
    
    /**
     * @dev Mint fungible or non-fungible token
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        _mint(to, id, amount, data);
        emit TokenMinted(to, id, amount);
    }
    
    /**
     * @dev Batch mint multiple tokens
     */
    function batchMint(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
    
    /**
     * @dev Burn tokens
     */
    function burn(
        address from,
        uint256 id,
        uint256 amount
    ) external {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "Not authorized");
        _burn(from, id, amount);
        emit TokenBurned(from, id, amount);
    }
    
    /**
     * @dev Batch burn tokens
     */
    function batchBurn(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "Not authorized");
        _burnBatch(from, ids, amounts);
    }
    
    /**
     * @dev Set URI for token type
     */
    function setURI(uint256 id, string memory newURI) external onlyOwner {
        tokenURIs[id] = newURI;
        emit URI(newURI, id);
    }
    
    /**
     * @dev Get balance of multiple tokens
     */
    function balanceOfBatch(
        address[] calldata accounts,
        uint256[] calldata ids
    ) public view override returns (uint256[] memory) {
        require(accounts.length == ids.length, "Length mismatch");
        
        uint256[] memory batchBalances = new uint256[](accounts.length);
        
        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }
        
        return batchBalances;
    }
}
