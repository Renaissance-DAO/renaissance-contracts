// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

interface IBetaArt {
    function mint(address account_, uint256 amount_) external;
}

contract BetaArtPresale is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct UserInfo {
        uint256 amount; // Amount DAI deposited by user
        uint256 debt; // total ART claimed thus bART debt
        bool claimed; // True if a user has claimed ART
    }

    struct TeamInfo {
        uint256 numWhitelist; // number of whitelists
        uint256 amount; // Amout DAI deposited by team
        uint256 debt; // total ART claimed thus bART debt
        bool claimed; // True if a team member has claimed ART
    }

    // Tokens to raise (DAI) & (FRAX) and for offer (bART) which can be swapped for (ART)
    IERC20 public DAI; // for user deposits
    IERC20 public FRAX; // for team deposits
    IERC20 public bART;
    IERC20 public ART;

    address public DAO; // Multisig treasury to send proceeds to

    address public CANVAS; // Multisig to send team proceeds to

    uint256 public price = 20 * 1e18; // 20 DAI per ART

    uint256 public cap = 500 * 1e18; // 1500 DAI cap per whitelisted user

    uint256 public totalRaisedDAI; // total DAI raised by sale
    uint256 public totalRaisedFRAX; // total FRAX raised by sale

    uint256 public totalDebt; // total bART and thus ART owed to users

    bool public started; // true when sale is started

    bool public ended; // true when sale is ended

    bool public claimable; // true when sale is claimable

    bool public claimBeta; // true when bART is claimable

    bool public contractPaused; // circuit breaker

    mapping(address => UserInfo) public userInfo;

    mapping(address => TeamInfo) public teamInfo;

    mapping(address => bool) public whitelisted; // True if user is whitelisted

    mapping(address => bool) public whitelistedTeam; // True if team member is whitelisted

    mapping(address => uint256) public artClaimable; // amount of art claimable by address

    event Deposit(address indexed who, uint256 amount);
    event Withdraw(address token, address indexed who, uint256 amount);
    event Mint(address token, address indexed who, uint256 amount);
    event SaleStarted(uint256 block);
    event SaleEnded(uint256 block);
    event ClaimUnlocked(uint256 block);
    event ClaimBetaUnlocked(uint256 block);
    event AdminWithdrawal(address token, uint256 amount);

    constructor(
        address _bART,
        address _ART,
        address _DAI,
        address _FRAX,
        address _DAO,
        address _CANVAS
    ) {
        require( _bART != address(0) );
        bART = IERC20(_bART);
        require( _ART != address(0) );
        ART = IERC20(_ART);
        require( _DAI != address(0) );
        DAI = IERC20(_DAI);
        require( _FRAX != address(0) );
        FRAX = IERC20(_FRAX);
        require( _DAO != address(0) );
        DAO = _DAO;
        require( _CANVAS != address(0) );
        CANVAS = _CANVAS;
    }

    //* @notice modifer to check if contract is paused
    modifier checkIfPaused() {
        require(contractPaused == false, "contract is paused");
        _;
    }
    /**
     *  @notice adds a single whitelist to the sale
     *  @param _address: address to whitelist
     */
    function addWhitelist(address _address) external onlyOwner {
        require(!started, "Sale has already started");
        whitelisted[_address] = true;
    }

    /**
     *  @notice adds multiple whitelist to the sale
     *  @param _addresses: dynamic array of addresses to whitelist
     */
    function addMultipleWhitelist(address[] calldata _addresses) external onlyOwner {
        require(!started, "Sale has already started");
        require(_addresses.length <= 333,"too many addresses");
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelisted[_addresses[i]] = true;
        }
    }

    /**
     *  @notice removes a single whitelist from the sale
     *  @param _address: address to remove from whitelist
     */
    function removeWhitelist(address _address) external onlyOwner {
        require(!started, "Sale has already started");
        whitelisted[_address] = false;
    }
    /**
     *  @notice adds a team member from sale
     *  @param _address: address to whitelist
     *  @param _numWhitelist: number of whitelists for address
     */
    function addTeam(address _address, uint256 _numWhitelist) external onlyOwner {
        require(!started, "Sale has already started");
        require(_numWhitelist != 0, "cannot set zero whitelists");
        whitelistedTeam[_address] = true;
        teamInfo[_address].numWhitelist = _numWhitelist;
    }

    /**
     *  @notice removes a team member from sale
     *  @param _address: address to remove from whitelist
     */
    function removeTeam(address _address) external onlyOwner {
        require(!started, "Sale has already started");
        whitelistedTeam[_address] = false;
        delete teamInfo[_address];
    }

    // @notice Starts the sale
    function start() external onlyOwner {
        require(!started, "Sale has already started");
        started = true;
        emit SaleStarted(block.number);
    }

    // @notice Ends the sale
    function end() external onlyOwner {
        require(started, "Sale has not started");
        require(!ended, "Sale has already ended");
        ended = true;
        emit SaleEnded(block.number);
    }

    // @notice lets users claim ART
    // @dev send sufficient ART before calling
    function claimUnlock() external onlyOwner {
        require(ended, "Sale has not ended");
        require(!claimable, "Claim has already been unlocked");
        require(ART.balanceOf(address(this)) >= totalDebt, 'not enough ART in contract');
        claimable = true;
        emit ClaimUnlocked(block.number);
    }


    // @notice lets users claim bART
    function claimBetaUnlock() external onlyOwner {
        require(claimable, "Claim has not been unlocked");
        require(!claimBeta, "Claim Beta has already been unlocked");
        claimBeta = true;
        emit ClaimBetaUnlocked(block.number);
    }

    // @notice lets owner pause contract
    function togglePause() external onlyOwner returns (bool){
        contractPaused = !contractPaused;
        return contractPaused;
    }
    /**
     *  @notice transfer ERC20 token to DAO multisig
     *  @param _token: token address to withdraw
     *  @param _amount: amount of token to withdraw
     */
    function adminWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20( _token ).safeTransfer( address(msg.sender), _amount );
        emit AdminWithdrawal(_token, _amount);
    }

    /**
     *  @notice it deposits DAI for the sale
     *  @param _amount: amount of DAI to deposit to sale (18 decimals)
     */
    function deposit(uint256 _amount) external checkIfPaused {
        require(started, 'Sale has not started');
        require(!ended, 'Sale has ended');
        require(whitelisted[msg.sender] == true, 'msg.sender is not whitelisted user');

        UserInfo storage user = userInfo[msg.sender];

        require(
            cap >= user.amount.add(_amount),
            'new amount above user limit'
            );

        user.amount = user.amount.add(_amount);
        totalRaisedDAI = totalRaisedDAI.add(_amount);

        uint256 payout = _amount.mul(1e18).div(price).div(1e9); // bART to mint for _amount

        totalDebt = totalDebt.add(payout);

        DAI.safeTransferFrom( msg.sender, DAO, _amount );

        IBetaArt( address(bART) ).mint( msg.sender, payout );

        emit Deposit(msg.sender, _amount);
    }
    /**
     *  @notice it deposits FRAX for the sale
     *  @param _amount: amount of FRAX to deposit to sale (18 decimals)
     *  @dev only for team members
     */
    function depositTeam(uint256 _amount) external checkIfPaused {
        require(started, 'Sale has not started');
        require(!ended, 'Sale has ended');
        require(whitelistedTeam[msg.sender] == true, 'msg.sender is not whitelisted team');

        TeamInfo storage team = teamInfo[msg.sender];

        require(
            cap.mul(team.numWhitelist) >= team.amount.add(_amount),
            'new amount above team limit'
            );

        team.amount = team.amount.add(_amount);
        totalRaisedFRAX = totalRaisedFRAX.add(_amount);

        uint256 payout = _amount.mul(1e18).div(price).div(1e9); // ART debt to claim

        totalDebt = totalDebt.add(payout);

        FRAX.safeTransferFrom( msg.sender, DAO, _amount );

        IBetaArt( address(bART) ).mint( CANVAS, payout );

        emit Deposit(msg.sender, _amount);
    }

    /**
     *  @notice it deposits bART to withdraw ART from the sale
     *  @param _amount: amount of bART to deposit to sale (9 decimals)
     */
    function withdraw(uint256 _amount) external checkIfPaused {
        require(claimable, 'ART is not yet claimable');
        require(_amount > 0, '_amount must be greater than zero');

        UserInfo storage user = userInfo[msg.sender];

        user.debt = user.debt.add(_amount);

        totalDebt = totalDebt.sub(_amount);

        bART.safeTransferFrom( msg.sender, address(this), _amount );

        ART.safeTransfer( msg.sender, _amount );

        emit Mint(address(bART), msg.sender, _amount);
        emit Withdraw(address(ART), msg.sender, _amount);
    }

    // @notice it checks a users DAI allocation remaining
    function getUserRemainingAllocation(address _user) external view returns ( uint256 ) {
        UserInfo memory user = userInfo[_user];
        return cap.sub(user.amount);
    }
    // @notice it claims bART back from the sale
    function claimBetaArt() external checkIfPaused {
        require(claimBeta, 'bART is not yet claimable');

        UserInfo storage user = userInfo[msg.sender];

        require(user.debt > 0, 'msg.sender has not participated');
        require(!user.claimed, 'msg.sender has already claimed');

        user.claimed = true;

        uint256 payout = user.debt;
        user.debt = 0;

        bART.safeTransfer( msg.sender, payout );

        emit Withdraw(address(bART),msg.sender, payout);
    }

}
