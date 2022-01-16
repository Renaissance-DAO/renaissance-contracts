// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import './interfaces/IERC20.sol';

interface IStaking {
    function stake( uint _amount, address _recipient ) external returns ( bool );
    function claim( address _recipient ) external;
}

contract StakingHelper {

    address public immutable staking;
    address public immutable ART;

    constructor ( address _staking, address _ART ) {
        require( _staking != address(0) );
        staking = _staking;
        require( _ART != address(0) );
        ART = _ART;
    }

    function stake( uint _amount ) external {
        IERC20( ART ).transferFrom( msg.sender, address(this), _amount );
        IERC20( ART ).approve( staking, _amount );
        IStaking( staking ).stake( _amount, msg.sender );
        IStaking( staking ).claim( msg.sender );
    }
}
