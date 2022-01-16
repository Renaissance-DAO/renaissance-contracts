// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import './interfaces/IERC20.sol';

contract StakingWarmup {

    address public immutable staking;
    address public immutable sART;

    constructor ( address _staking, address _sART ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _sART != address(0) );
        sART = _sART;
    }

    function retrieve( address _staker, uint _amount ) external {
        require( msg.sender == staking );
        IERC20( sART ).transfer( _staker, _amount );
    }
}
