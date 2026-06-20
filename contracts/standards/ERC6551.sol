// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC-6551 Token Bound Account (TBA)
 * @dev NFT owns its own smart contract wallet
 */

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

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

contract TokenBoundAccount is IERC6551Account {
    
    // Immutable storage of NFT reference
    address private immutable _nftContract;
    uint256 private immutable _tokenId;
    uint256 private immutable _chainId;
    
    event Executed(
        address indexed target,
        uint256 value,
        bytes data
    );
    
    constructor(
        address nftContract,
        uint256 tokenId,
        uint256 chainId
    ) {
        _nftContract = nftContract;
        _tokenId = tokenId;
        _chainId = chainId;
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {}
    
    /**
     * @dev Execute transaction from TBA
     * Only NFT owner can call this
     */
    function execute(
        address target,
        uint256 value,
        bytes calldata data,
        uint8 operation
    ) external override returns (bytes memory) {
        require(msg.sender == owner(), "Not authorized");
        require(target != address(0), "Invalid target");
        
        (bool success, bytes memory result) = target.call{value: value}(data);
        require(success, "Execution failed");
        
        emit Executed(target, value, data);
        return result;
    }
    
    /**
     * @dev Batch execute multiple transactions
     */
    function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas
    ) external returns (bytes[] memory) {
        require(msg.sender == owner(), "Not authorized");
        require(targets.length == values.length && targets.length == datas.length, "Length mismatch");
        
        bytes[] memory results = new bytes[](targets.length);
        
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, bytes memory result) = targets[i].call{value: values[i]}(datas[i]);
            require(success, "Batch execution failed");
            results[i] = result;
        }
        
        return results;
    }
    
    /**
     * @dev Get current owner (NFT owner)
     */
    function owner() public view override returns (address) {
        return IERC721(_nftContract).ownerOf(_tokenId);
    }
    
    /**
     * @dev Get token information
     */
    function token() public view override returns (address, uint256) {
        return (_nftContract, _tokenId);
    }
    
    /**
     * @dev Get chain ID
     */
    function chainId() public view returns (uint256) {
        return _chainId;
    }
    
    /**
     * @dev Get contract address for NFT
     */
    function nftContract() public view returns (address) {
        return _nftContract;
    }
    
    /**
     * @dev Get NFT token ID
     */
    function tokenId() public view returns (uint256) {
        return _tokenId;
    }
    
    /**
     * @dev Delegate call execution (advanced)
     */
    function delegateExecute(
        address target,
        bytes calldata data
    ) external returns (bytes memory) {
        require(msg.sender == owner(), "Not authorized");
        require(target != address(0), "Invalid target");
        
        (bool success, bytes memory result) = target.delegatecall(data);
        require(success, "Delegate execution failed");
        
        return result;
    }
    
    /**
     * @dev Withdraw ETH to owner
     */
    function withdraw(uint256 amount) external {
        require(msg.sender == owner(), "Not authorized");
        require(address(this).balance >= amount, "Insufficient balance");
        
        (bool success,) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Confirm this is a valid TBA
     */
    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4)
    {
        // Implement ERC-1271 for signature validation
        // This allows TBA to verify signatures on behalf of NFT owner
        return bytes4(0x00000000); // Not implemented
    }
}

/**
 * @title TBA Registry
 * @dev Creates and manages Token Bound Accounts
 */
contract TBARegistry {
    
    event AccountCreated(
        address indexed account,
        address indexed nftContract,
        uint256 tokenId,
        address indexed owner
    );
    
    mapping(address => mapping(uint256 => address)) public accounts;
    
    /**
     * @dev Create or get TBA for NFT
     */
    function createAccount(
        address nftContract,
        uint256 tokenId
    ) external returns (address) {
        address account = getAccount(nftContract, tokenId);
        
        if (account == address(0)) {
            // Deploy new TBA
            account = address(new TokenBoundAccount(
                nftContract,
                tokenId,
                block.chainid
            ));
            
            accounts[nftContract][tokenId] = account;
            
            address owner = IERC721(nftContract).ownerOf(tokenId);
            emit AccountCreated(account, nftContract, tokenId, owner);
        }
        
        return account;
    }
    
    /**
     * @dev Get TBA for NFT
     */
    function getAccount(
        address nftContract,
        uint256 tokenId
    ) public view returns (address) {
        return accounts[nftContract][tokenId];
    }
    
    /**
     * @dev Predict TBA address (for pre-funding)
     */
    function predictAccount(
        address nftContract,
        uint256 tokenId
    ) external view returns (address) {
        // Use create2 to predict deterministic address
        bytes32 salt = keccak256(abi.encode(nftContract, tokenId));
        
        bytes memory bytecode = abi.encodePacked(
            type(TokenBoundAccount).creationCode,
            abi.encode(nftContract, tokenId, block.chainid)
        );
        
        bytes32 hash = keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            salt,
            keccak256(bytecode)
        ));
        
        return address(uint160(uint256(hash)));
    }
}
