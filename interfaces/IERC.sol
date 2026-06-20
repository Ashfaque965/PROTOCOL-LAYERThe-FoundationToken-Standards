// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC4907 - Rental NFT Interface
 */
interface IERC4907 {
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);
    
    function setUser(uint256 tokenId, address user, uint64 expires) external;
    function userOf(uint256 tokenId) external view returns (address);
    function userExpires(uint256 tokenId) external view returns (uint256);
}

/**
 * @title IERC6551Account - Token Bound Account Interface
 */
interface IERC6551Account {
    function execute(
        address target,
        uint256 value,
        bytes calldata data,
        uint8 operation
    ) external returns (bytes memory);
    
    function owner() external view returns (address);
    function token() external view returns (address, uint256);
}

/**
 * @title IERC6551Registry - Token Bound Account Registry
 */
interface IERC6551Registry {
    event AccountCreated(
        address indexed account,
        address indexed nftContract,
        uint256 indexed tokenId
    );
    
    function createAccount(
        address nftContract,
        uint256 tokenId
    ) external returns (address);
    
    function getAccount(
        address nftContract,
        uint256 tokenId
    ) external view returns (address);
}

/**
 * @title IOwnable - Ownership Interface
 */
interface IOwnable {
    function owner() external view returns (address);
    function transferOwnership(address newOwner) external;
}

/**
 * @title IAccessControl - Role-Based Access Control
 */
interface IAccessControl {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function grantRole(bytes32 role, address account) external;
    function revokeRole(bytes32 role, address account) external;
    function renounceRole(bytes32 role, address account) external;
}

/**
 * @title IPausable - Pausable Pattern
 */
interface IPausable {
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    
    function pause() external;
    function unpause() external;
    function paused() external view returns (bool);
}
