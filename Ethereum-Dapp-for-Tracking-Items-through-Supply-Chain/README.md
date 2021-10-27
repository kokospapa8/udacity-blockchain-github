# Ethereum-Dapp-for-Tracking-Items-through-Supply-Chain
In this project I created a DApp supply chain solution backed by the Ethereum platform. I architected smart contracts that manage specific user permission controls as well as contracts that track and verify a product’s authenticity. 

## The contract addresses of this dapp

| Contract Name | Contract Address|
|:--------------|:----------------|
|FarmerRole|0x456796022058Ac77cE362Fe5B31A63e4c278F214|
|DistributorRole|0xE7Baa9510d3F8c114847DA66aa8E993D159dC46E|
|RetailerRole|0x275F03423f0453dcc2cf290D2a00D0C138b867C3|
|ConsumerRole|0x935C7B1dEB7b751E22D096867be3619B6bac293F
|SupplyChain|0x356167932B271B43d0B2443A1c5603604adE2059|

## Libraries
* ```truffle-hdwallet-provider``` was used in order to sign transactions for addresses derived from a 12-word mnemonic.

## Program version numbers
* **Node**: v12.18.1
* **Truffle**: v5.1.14-nodeLTS.0 (core: 5.1.13)
* **Web3**: v1.2.1

## Usage

### Product Overview
To fetch data related to the given item (item's SKU and UPC, owner's ID, original farmer's ID etc.) you can use either of the two _Fetch Data_ options.
![](screenshots/Product_Overview.PNG)

### Farm Details
In order, as a farmer, to harverst, process, pack, sell your beans you need to input the requested data/info in this section of our DAPP.
![](screenshots/Farm_Details.PNG)

### Product Details
If you are a _Distributor_ or a _Retailer_ this section is for you. Here you can buy and ship (as a retailer) the beans and purchase, as well receive them (as a retailer).
![](screenshots/Product_Details.PNG)

### Transaction History
In this section of our DApp, you have a complete history of all the transactions.
![](screenshots/Transaction_History.PNG)
