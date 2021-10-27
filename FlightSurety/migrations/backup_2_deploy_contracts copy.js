const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require("fs");

module.exports = function (deployer, network, accounts) {
  let firstAirline = accounts[1];
  deployer.deploy(FlightSuretyData).then((dataContract) => {
    await dataContract.addAirline(firstAirline, "JetFirst Airlines");
    await dataContract.registerAirline(firstAirline);

    return deployer.deploy(FlightSuretyApp).then((appContract) => {
      await dataContract.authorizeCaller(FlightSuretyApp.address);
      await appContract.FundAirline({
        from: firstAirline,
        value: Web3.utils.toWei("10", "ether"),
      });

      const timestamp = Math.floor(Date.now() / 1000);
      await appContract.registerFlight(firstAirline, "AVBSDSSDS", timestamp);
      await appContract.registerFlight(firstAirline, "ASDVASDQ1", timestamp);
      await appContract.registerFlight(firstAirline, "ASVDWDWQQ", timestamp);

      let config = {
        localhost: {
          url: "http://localhost:8545",
          dataAddress: FlightSuretyData.address,
          appAddress: FlightSuretyApp.address,
        },
      };
      fs.writeFileSync(
        __dirname + "/../src/dapp/config.json",
        JSON.stringify(config, null, "\t"),
        "utf-8"
      );
      fs.writeFileSync(
        __dirname + "/../src/server/config.json",
        JSON.stringify(config, null, "\t"),
        "utf-8"
      );
    });
  });
};
