// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.7.5;

import "./interfaces/IART.sol";
import "./types/ERC20Permit.sol";
import "./types/Ownable.sol";
import "./types/RenaissanceAccessControlled.sol";

contract Art is ERC20Permit, IART, RenaissanceAccessControlled {
  using SafeMath for uint256;

    constructor(address _authority)
    ERC20("Art", "ART", 9)
    ERC20Permit("Art") 
    RenaissanceAccessControlled(IRenaissanceAuthority(_authority)) {}

    function mint(address account_, uint256 amount_) external override onlyVault {
        _mint(account_, amount_);
    }

    function burn(uint256 amount) external override {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account_, uint256 amount_) external override {
        _burnFrom(account_, amount_);
    }

    function _burnFrom(address account_, uint256 amount_) internal {
        uint256 decreasedAllowance_ = allowance(account_, msg.sender).sub(amount_, "ERC20: burn amount exceeds allowance");

        _approve(account_, msg.sender, decreasedAllowance_);
        _burn(account_, amount_);
    }
}
