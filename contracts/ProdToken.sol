// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract ProdToken is ERC20, ERC20Burnable, ERC20Capped, ERC20Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    error LengthMismatch();
    error CapExceeded();

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap_,              // 18 decimals
        address initialReceiver,
        uint256 initialMint        // 18 decimals
    )
        ERC20(name_, symbol_)
        ERC20Capped(cap_)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        if (initialMint > cap_) revert CapExceeded();
        _mint(initialReceiver, initialMint); // OK: _mint is internal (non-virtual) in v5
    }

    function pause() external onlyRole(PAUSER_ROLE) { _pause(); }
    function unpause() external onlyRole(PAUSER_ROLE) { _unpause(); }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount); // cap enforcement handled by ERC20Capped via _update override
    }

    function airdrop(address[] calldata to, uint256[] calldata amounts)
        external
        onlyRole(MINTER_ROLE)
    {
        if (to.length != amounts.length) revert LengthMismatch();

        uint256 total;
        for (uint256 i = 0; i < amounts.length; i++) total += amounts[i];
        if (totalSupply() + total > cap()) revert CapExceeded();

        for (uint256 i = 0; i < to.length; i++) {
            _mint(to[i], amounts[i]); // uses ERC20Capped/Paused checks via _update
        }
    }

    // v5: combine parent logic via _update (NOT _mint)
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

