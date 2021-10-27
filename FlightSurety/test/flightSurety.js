var Test = require("../config/testConfig.js");
var BigNumber = require("bignumber.js");
const Web3 = require("web3");

contract("Flight Surety Tests", async (accounts) => {
  var config;
  let firstAirline;
  let passenger;
  let TEST_FLIGHT = "ASDF1234";
  const CREDIT_MULTIPLIER = 15;

  before("setup contract", async () => {
    config = await Test.Config(accounts);
    firstAirline = config.firstAirline;
    passenger = accounts[9];

    await config.flightSuretyData.authorizeCaller(
      config.flightSuretyApp.address
    );
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/
  it(`(airline)First airline registered.`, async function () {
    let registered = await config.flightSuretyData.isRegistered.call(
      firstAirline
    );
    assert.equal(registered, true, "First airline not registered on deploy");

    let funded = await config.flightSuretyData.isFunded.call(firstAirline);
    assert.equal(funded, true, "First airline should be funded on deploy");
  });

  it(`(multiparty) has correct initial isOperational() value`, async function () {
    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");
    await config.flightSuretyData.setOperatingStatus(false);

    status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, false, "Incorrect operating status value after set");
  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {
    // Ensure that access is denied for non-Contract Owner account
    let accessDenied = false;
    try {
      await config.flightSuretyData.setOperatingStatus(false, {
        from: config.testAddresses[2],
      });
    } catch (e) {
      accessDenied = true;
    }
    assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {
    // Ensure that access is allowed for Contract Owner account
    let accessDenied = false;
    try {
      await config.flightSuretyData.setOperatingStatus(false);
    } catch (e) {
      accessDenied = true;
    }
    assert.equal(
      accessDenied,
      false,
      "Access not restricted to Contract Owner"
    );
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {
    await config.flightSuretyData.setOperatingStatus(false);

    let reverted = false;
    try {
      await config.flightSurety.setTestingMode(true);
    } catch (e) {
      reverted = true;
    }
    assert.equal(reverted, true, "Access not blocked for requireIsOperational");

    // Set it back for other tests to work
    await config.flightSuretyData.setOperatingStatus(true);
  });

  it("(airline) cannot register an Airline if it is not funded", async () => {
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
      await config.flightSuretyApp.registerAirline(newAirline, {
        from: config.firstAirline,
      });
    } catch (e) {}
    let result = await config.flightSuretyData.airlineExists.call(newAirline);

    // ASSERT
    assert.equal(
      result,
      false,
      "Cannot register another airline if not funded"
    );
  });

  it(`(multiparty) Need at least four airline for new registration`, async function () {
    let secondAirline = accounts[2];
    let airlineToRegister = accounts[3];
    let errorThrown;

    // Add and fund airline
    await config.flightSuretyData.addAirline(secondAirline, "Test Airlines #1");
    await config.flightSuretyApp.FundAirline({
      from: secondAirline,
      value: Web3.utils.toWei("10", "ether"),
      gasPrice: 0,
    });
    // Attempt to add and register airline from Test Airlines #1
    await config.flightSuretyData.addAirline(
      airlineToRegister,
      "Test Airlines #2"
    );

    try {
      await config.flightSuretyApp.registerAirline(airlineToRegister, {
        from: secondAirline,
      });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown,
      undefined,
      "Should be error registering without firstAirline"
    );
    assert.isAbove(
      errorThrown.message.search(
        "Requires first airline to register first 4 airlines"
      ),
      -1,
      "Should be error registering without firstAirline"
    );

    await config.flightSuretyApp.registerAirline(airlineToRegister, {
      from: firstAirline,
    });
    let isRegistered = await config.flightSuretyData.isRegistered.call(
      airlineToRegister
    );
    assert.equal(isRegistered, true, "Airline not registered");
  });

  it(`(multiparty) Multi-party consensus of 50% of registered airlines`, async function () {
    await config.flightSuretyData.addAirline(accounts[2], "Test Airline 2");
    await config.flightSuretyApp.registerAirline(accounts[2], {
      from: firstAirline,
    });

    await config.flightSuretyData.addAirline(accounts[3], "Test Airline 3");
    await config.flightSuretyApp.registerAirline(accounts[3], {
      from: firstAirline,
    });

    await config.flightSuretyData.addAirline(accounts[4], "Test Airline 4");
    await config.flightSuretyApp.registerAirline(accounts[4], {
      from: firstAirline,
    });

    unregisteredAirline = accounts[5];
    await config.flightSuretyData.addAirline(
      unregisteredAirline,
      "Test Airline 5"
    );

    await config.flightSuretyApp.FundAirline({
      from: unregisteredAirline,
      value: Web3.utils.toWei("10", "ether"),
      gasPrice: 0,
    });
    let errorThrown;
    try {
      await config.flightSuretyApp.registerAirline(unregisteredAirline, {
        from: unregisteredAirline,
      });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown,
      undefined,
      "Should be error for registering airline not registered"
    );
    assert.isAbove(
      errorThrown.message.search("Requires registering airline is registered"),
      -1,
      "ReShould be error thrown for registering airline not registered"
    );

    await config.flightSuretyApp.registerAirline(accounts[5], {
      from: firstAirline,
    });

    // Test voting multiple times fails
    errorThrown = undefined;
    try {
      await config.flightSuretyApp.registerAirline(accounts[5], {
        from: firstAirline,
      });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown,
      undefined,
      "Should be error  for registering airline hasn't already voted"
    );
    assert.isAbove(
      errorThrown.message.search(
        "Requires registering airline hasn't already voted"
      ),
      -1,
      "Should be error for registering airline hasn't already voted"
    );

    await config.flightSuretyApp.FundAirline({
      from: accounts[2],
      value: Web3.utils.toWei("10", "ether"),
      gasPrice: 0,
    });
    await config.flightSuretyApp.registerAirline(accounts[5], {
      from: accounts[2],
    });
    await config.flightSuretyApp.FundAirline({
      from: accounts[3],
      value: Web3.utils.toWei("10", "ether"),
      gasPrice: 0,
    });
    await config.flightSuretyApp.registerAirline(accounts[5], {
      from: accounts[3],
    });

    // 3/5, 60% of the votes to register the airline have been cast
    let wasRegistered = await config.flightSuretyData.isRegistered.call(
      accounts[5]
    );
    assert.equal(wasRegistered, true, "Airline not registered by consensus");
  });

  it(`(multiparty) Airline cannot partipate until funding odone`, async function () {
    let errorThrown;
    await config.flightSuretyData.addAirline(accounts[6], "Test Airline 6");

    try {
      await config.flightSuretyApp.FundAirline({
        from: accounts[6],
        value: 9,
        gasPrice: 0,
      });
    } catch (error) {
      errorThrown = error;
    }
    assert.notEqual(
      errorThrown,
      undefined,
      "Should be error for not providing enough funding"
    );
    assert.isAbove(
      errorThrown.message.search("Requires registration funds be 10 ether"),
      -1,
      "Should be error for not providing enough funding"
    );

    const balanceBeforeTransaction = await web3.eth.getBalance(firstAirline);
    await config.flightSuretyApp.FundAirline({
      from: accounts[6],
      value: Web3.utils.toWei("10", "ether"),
      gasPrice: 0,
    });
    const balanceAfterTransaction = await web3.eth.getBalance(firstAirline);
    assert.equal(
      balanceBeforeTransaction - balanceAfterTransaction,
      0,
      "Balance should be 10"
    );

    wasFunded = await config.flightSuretyData.isFunded.call(accounts[6]);
    assert.equal(wasFunded, true, "First airline should funded after funding");
  });

  it(`(flight) Can register and retrieve a flight`, async function () {
    const timestamp = Math.floor(Date.now() / 1000);

    await config.flightSuretyApp.registerFlight(
      firstAirline,
      TEST_FLIGHT,
      timestamp
    );

    let tx = await config.flightSuretyApp.fetchFlightStatus(
      firstAirline,
      "firstAirline",
      timestamp
    );
    let event = tx.logs[0].event;
    assert.equal(event, "OracleRequest", "Invalid event emitted");
  });

  it(`(insurance) Passengers butying insurance`, async function () {
    const amountToInsure = Web3.utils.toWei("1", "ether");

    const balanceBeforeTransaction = await web3.eth.getBalance(passenger);
    await config.flightSuretyApp.buyInsurance(firstAirline, TEST_FLIGHT, {
      from: passenger,
      value: amountToInsure,
      gasPrice: 0,
    });
    const balanceAfterTransaction = await web3.eth.getBalance(passenger);
    assert.equal(
      balanceBeforeTransaction - balanceAfterTransaction,
      Web3.utils.toWei("1", "ether")
    );

    //Credit insuree
    await config.flightSuretyData.creditInsurees(
      firstAirline,
      TEST_FLIGHT,
      CREDIT_MULTIPLIER
    );
  });

  it(`(insurance) Passenger withrawing credit`, async function () {
    const CREDITS_DUE = Web3.utils.toWei("1.5", "ether");
    const balanceBeforeTransaction = await web3.eth.getBalance(passenger);
    await config.flightSuretyApp.withdrawCredits({
      from: passenger,
      gasPrice: 0,
    });

    const balanceAfterTransaction = await web3.eth.getBalance(passenger);
    assert.equal(
      balanceAfterTransaction - balanceBeforeTransaction,
      CREDITS_DUE
    );
  });
});
