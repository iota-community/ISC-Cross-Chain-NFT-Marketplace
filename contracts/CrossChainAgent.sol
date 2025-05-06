// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrossChainAgent is NonblockingLzApp {
    address public marketplace;
    mapping(address => uint256) public balances;

    event CustomMessageReceived(
        uint256 amount,
        address tokenAddress,
        uint256 tokenId,
        address to
    );
    event EmitPayload(bytes payload);

    constructor(
        address _lzEndpoint,
        address _marketplace
    ) NonblockingLzApp(_lzEndpoint) {
        marketplace = _marketplace;
    }

    /// @notice This function is called by LayerZero when a cross-chain message is received
    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64 _nonce,
        bytes memory _payload
    ) internal override {
        // Decode the payload
        (
            bytes memory toAddressBytes,
            uint256 amount,
            address tokenAddress,
            uint256 tokenId
        ) = abi.decode(_payload, (bytes, uint256, address, uint256));

        // Convert toAddressBytes to an address
        address to;
        assembly {
            to := mload(add(toAddressBytes, 20))
        }

        // Increment the user's balance
        balances[to] += amount;

        // Emit events
        emit CustomMessageReceived(amount, tokenAddress, tokenId, to);
        emit EmitPayload(_payload);

        // Notify the marketplace that the balance is updated (this could be another cross-chain message)
        _notifyMarketplace(tokenAddress, tokenId, to, balances[to]);
    }

    /// @notice this function is to be called by the user to buy an NFT on BNB
    function buyCrossChain(
        uint16 _dstChainId,
        address _user,
        address _tokenAddress,
        address _nftAddress,
        uint256 _amount,
        uint256 _tokenId,
        address payable refundAddress,
        bytes memory adapterParams
    ) public payable {
        IERC20(_tokenAddress).transferFrom(_user, address(this), _amount);

        // Update user balance on this chain
        balances[_user] += _amount;

        // Encode the payload with the required data
        bytes memory payload = abi.encode(
            abi.encodePacked(_user),
            _amount,
            _nftAddress,
            _tokenId
        );

        // Send the payload to the agent on iota
        _lzSend(
            _dstChainId,
            payload,
            refundAddress,
            address(0x0),
            adapterParams,
            msg.value
        );
    }

    /// @notice Notify the marketplace of the user's balance (sends data to the marketplace)
    function _notifyMarketplace(
        address nftAddress,
        uint256 tokenId,
        address buyer,
        uint256 amount
    ) internal {
        // Here we will interact with the marketplace directly to call `buyItemCrossChain`
        (bool success, ) = marketplace.call(
            abi.encodeWithSignature(
                "buyItemCrossChain(address,uint256,address, uint256)",
                nftAddress,
                tokenId,
                buyer,
                amount
            )
        );
        require(success, "Failed to notify marketplace");
    }

    /// @notice Estimate the LayerZero fees
    function estimateFee(
        uint16 _dstChainId,
        bool _useZro,
        bytes calldata _adapterParams
    ) public view returns (uint nativeFee, uint zroFee) {
        bytes memory payload = abi.encode(
            "",
            uint256(0),
            address(0),
            uint256(0)
        ); // Empty payload for estimation
        return
            lzEndpoint.estimateFees(
                _dstChainId,
                address(this),
                payload,
                _useZro,
                _adapterParams
            );
    }

    /// @notice Set the oracle for cross-chain operations
    function setOracle(uint16 dstChainId, address oracle) external onlyOwner {
        uint TYPE_ORACLE = 6;
        lzEndpoint.setConfig(
            lzEndpoint.getSendVersion(address(this)),
            dstChainId,
            TYPE_ORACLE,
            abi.encode(oracle)
        );
    }

    /// @notice Get the current oracle for a remote chain
    function getOracle(
        uint16 remoteChainId
    ) external view returns (address _oracle) {
        bytes memory bytesOracle = lzEndpoint.getConfig(
            lzEndpoint.getSendVersion(address(this)),
            remoteChainId,
            address(this),
            6
        );
        assembly {
            _oracle := mload(add(bytesOracle, 32))
        }
    }
}
