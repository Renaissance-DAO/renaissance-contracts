// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "../types/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PresaleOwned is Ownable {
    
  address internal _presale;

  function setPresale( address presale_ ) external onlyOwner returns ( bool ) {
    _presale = presale_;

    return true;
  }

  /**
   * @dev Returns the address of the current vault.
   */
  function presale() public view returns (address) {
    return _presale;
  }

  /**
   * @dev Throws if called by any account other than the vault.
   */
  modifier onlyPresale() {
    require( _presale == msg.sender, "PresaleOwned: caller is not the Presale" );
    _;
  }

}

contract aArt is ERC20Permit, PresaleOwned {

  using SafeMath for uint256;

    constructor()
    ERC20("Alpha Art", "aART", 9)
    ERC20Permit("Alpha Art"){}

    function mint(address account_, uint256 amount_) external onlyPresale() {
        _mint(account_, amount_);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual {
        _burn(msg.sender, amount);
    }

    /*
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
     
    function burnFrom(address account_, uint256 amount_) public virtual {
        _burnFrom(account_, amount_);
    }

    function _burnFrom(address account_, uint256 amount_) public virtual {
        uint256 decreasedAllowance_ =
            allowance(account_, msg.sender).sub(
                amount_,
                "ERC20: burn amount exceeds allowance"
            );

        _approve(account_, msg.sender, decreasedAllowance_);
        _burn(account_, amount_);
    }
}
