pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    bool private operational = true; // Blocks all state changes throughout the contract if false
    address[] private registeredAirlines;

    mapping(address => Airline) public airlines;
    mapping(bytes32 => Flight) public flights;
    mapping(address => uint256) public withdrawals;
    mapping(address => bool) public authorizedCallers;
    mapping(bytes32 => bool) private airlineRegistrationVotes;
    mapping(bytes32 => Insurance[]) private policies;
    mapping(address => uint256) private credits;
    address public firstAirline;

    // Airlines
    struct Airline {
        address airlineAddress;
        string airlineName;
        bool registered;
        bool funded;
        uint256 registrationVotes;
    }

    // Flights
    struct Flight {
        string flight;
        bool registered;
        uint8 statusCode;
        uint256 updatedTimestamp;
        address airline;
        uint256 price;
    }

    struct Insurance {
        address insuree;
        uint256 amount;
    }

    //Passengers
    address[] internal passengers;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event Paid(address recipient, uint256 amount);
    event Funded(address airline);
    event Registered(address airline);
    event Credited(address passenger, uint256 amount);
    event Insured(address passenger, uint256 amount);

    /**
     * @dev Constructor
     *      The deploying account becomes contractOwner
     */
    constructor() public {
        contractOwner = msg.sender;
        authorizedCallers[msg.sender] = true;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
     * @dev Modifier that requires the "operational" boolean variable to be "true"
     *      This is used on all state changing functions to pause the contract in
     *      the event there is an issue that needs to be fixed
     */
    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _; // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
     * @dev Modifier that requires the "ContractOwner" account to be the function caller
     */
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
     * @dev Modifier that requires that the caller is authorized
     */
    modifier requireAuthorizedCaller() {
        require(
            authorizedCallers[msg.sender] == true,
            "Address not authorized"
        );
        _;
    }

    /**
     * @dev Modifier that requires that flight is registered
     */
    modifier registeredFlight(bytes32 flightKey) {
        require(flights[flightKey].registered, "This flight does not exist");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
     * @dev Get operating status of contract
     *
     * @return A bool that is the current operating status
     */
    function isOperational() public view returns (bool) {
        return operational;
    }

    /**
     * @dev Sets contract operations on/off
     *
     * When operational mode is disabled, all write transactions except for this one will fail
     */
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    /**
     * @dev authorize caller
     *
     * When function to authorize addresses
     */
    function authorizeCaller(address callerAddress)
        external
        requireContractOwner
    {
        authorizedCallers[callerAddress] = true;
    }

    /**
     * @dev check airline is funded
     */
    function isFunded(address airlineAddress)
        external
        view
        requireAuthorizedCaller
        requireIsOperational
        returns (bool)
    {
        return airlines[airlineAddress].funded;
    }

    /**
     * @dev check airline is registered
     */
    function isRegistered(address airlineAddress)
        external
        view
        requireAuthorizedCaller
        requireIsOperational
        returns (bool)
    {
        return airlines[airlineAddress].registered;
    }

    /**
     * @dev Get all registered airlines.
     */
    function getRegisteredAirlines()
        external
        view
        requireAuthorizedCaller
        requireIsOperational
        returns (address[] memory)
    {
        return registeredAirlines;
    }

    function registerFlight(
        bytes32 flightKey,
        address airlineAddress,
        string flight,
        uint256 timestamp
    ) external requireAuthorizedCaller requireIsOperational {
        flights[flightKey] = Flight({
            registered: true,
            statusCode: 0,
            updatedTimestamp: timestamp,
            airline: airlineAddress,
            flight: flight,
            price: 0
        });
    }

    function getFlightPrice(bytes32 flightKey)
        external
        view
        returns (uint256 price)
    {
        price = flights[flightKey].price;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
    function addAirline(address airlineAddress, string airlineName)
        external
        requireAuthorizedCaller
        requireIsOperational
    {
        airlines[airlineAddress] = Airline({
            airlineAddress: airlineAddress,
            airlineName: airlineName,
            registered: false,
            funded: false,
            registrationVotes: 0
        });
    }

    function fundAirline(address airlineAddress)
        external
        requireAuthorizedCaller
        requireIsOperational
    {
        airlines[airlineAddress].funded = true;
        emit Funded(airlineAddress);
    }

    function voteAirline(address voter, address votee)
        external
        requireAuthorizedCaller
        requireIsOperational
        returns (uint256)
    {
        bytes32 voteHash = keccak256(abi.encodePacked(voter, votee));
        airlineRegistrationVotes[voteHash] = true;
        airlines[votee].registrationVotes += 1;

        return airlines[votee].registrationVotes;
    }

    function isVoted(address voter, address votee)
        external
        view
        requireAuthorizedCaller
        requireIsOperational
        returns (bool)
    {
        bytes32 voteHash = keccak256(abi.encodePacked(voter, votee));
        return airlineRegistrationVotes[voteHash] == true;
    }

    /* Is airline in the list
     */
    function airlineExists(address airlineAddress)
        external
        view
        requireAuthorizedCaller
        requireIsOperational
        returns (bool)
    {
        return airlines[airlineAddress].airlineAddress == airlineAddress;
    }

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */
    function registerAirline(address airlineAddress)
        external
        requireAuthorizedCaller
        requireIsOperational
    {
        airlines[airlineAddress].registered = true;
        registeredAirlines.push(airlineAddress);
        emit Registered(airlineAddress);
    }

    /**
     * @dev Buy insurance for a flight
     *
     */
    function buy(
        address airlineAddress,
        string flight,
        address _insuree,
        uint256 amountToInsureFor
    ) external payable requireIsOperational {
        bytes32 policyKey = keccak256(abi.encodePacked(airlineAddress, flight));
        policies[policyKey].push(
            Insurance({insuree: _insuree, amount: amountToInsureFor})
        );
        emit Insured(msg.sender, msg.value);
    }

    /**
     *  @dev Credits payouts to insurees
     */
    function creditInsurees(
        address airlineAddress,
        string flight,
        uint256 creditMultiplier
    ) external requireAuthorizedCaller requireIsOperational {
        bytes32 policyKey = keccak256(abi.encodePacked(airlineAddress, flight));
        Insurance[] memory policiesToCredit = policies[policyKey];

        uint256 currentCredits;
        address insuree;

        for (uint256 i = 0; i < policiesToCredit.length; i++) {
            insuree = policiesToCredit[i].insuree;
            currentCredits = credits[insuree];
            // Calculate payout with multiplier and add to existing credits
            // uint256 creditsPayout = policiesToCredit[i].amount.mul(
            //     creditMultiplier
            // );
            uint256 creditsPayout = (
                policiesToCredit[i].amount.mul(creditMultiplier).div(10)
            );

            credits[insuree] = currentCredits.add(creditsPayout);
            emit Credited(insuree, creditsPayout);
        }

        delete policies[policyKey];
    }

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    function pay(address insuree)
        external
        requireAuthorizedCaller
        requireIsOperational
    {
        uint256 amount = credits[insuree];
        require(amount > 0, "no credit for insuree left.");
        credits[insuree] = 0;
        insuree.transfer(amount);
        emit Paid(insuree, amount);
    }

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */
    function fund() public payable {}

    /**
     * @dev Fallback function for funding smart contract.
     *
     */
    function() external payable {
        fund();
    }
}
