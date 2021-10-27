# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product.
[FAQ](https://andresaaap.medium.com/capstone-real-estate-marketplace-project-faq-udacity-blockchain-69fe13b4c14e)

## npm

install modules

```
npm install
```

## Zokrates

```# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product.
[FAQ](https://andresaaap.medium.com/capstone-real-estate-marketplace-project-faq-udacity-blockchain-69fe13b4c14e)

## npm

install modules

```
npm install
```

## Zokrates

```
docker run -v /Users/jinwookbaek/Project/blockchain/Blockchain-Capstone/zokrates/code:/home/zokrates/code -ti zokrates/zokrates /bin/bash
# compile
zokrates compile -i square.code
# perform the setup phase
zokrates setup
# execute the program
zokrates compute-witness -a 3 9 // Here we usually use a root and its square
# generate a proof of computation
zokrates generate-proof
# export a solidity verifier
zokrates export-verifier
```

## Deploying Rinkeby

set metmask mnemonic `.secret` file and place it in `eth-contracts/`
`truffle migrate --network rinkeby --reset`

## Mint

- using [myetherwallet](https://www.youtube.com/watch?v=8MChn-NJJB0) didn't work
- used script (created 10 proofs manually)
  - node mint/mint.js
- https://rinkeby.etherscan.io/address/0xdca5b1399e027a45674a7dcc931df81e506f1360

## Contract info

| Contract Name      | Contract Address                           |
| ------------------ | ------------------------------------------ |
| Migrations         | 0x5f41192ea0bF3720729dae8D998Ca067E66C80fE |
| Verifier           | 0xb64c55e07E93FB67EE6bEa9C5cE414B933A7D76a |
| SolnSquareVerifier | 0xdCa5B1399e027a45674A7dCc931df81e506f1360 |

## OpenSea link's

https://testnets.opensea.io/get-listed/step-two
https://knowledge.udacity.com/questions/133570

- Marketplace Seller: https://testnets.opensea.io/collection/unidentified-contract-pdqv7iegkv
- Marketplace Buyer: https://testnets.opensea.io/0x52ff8d8ea92628a7618d5cbbaa501e4b30a43995

# Dependency

- lite-server@2.4.0
- openzeppelin-solidity@2.5.1
- solc-js@0.5.5
- solc@0.5.17
- truffle-hdwallet-provider@1.0.17
- Truffle v5.4.16 (core: 5.4.16)
- Solidity v0.5.16 (solc-js)
- Node v12.16.2
- Web3.js v1.5.3

# Project Resources

- [Remix - Solidity IDE](https://remix.ethereum.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Truffle Framework](https://truffleframework.com/)
- [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
- [Open Zeppelin ](https://openzeppelin.org/)
- [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
- [Docker](https://docs.docker.com/install/)
- [ZoKrates](https://github.com/Zokrates/ZoKrates)

# compile
zokrates compile -i square.code
# perform the setup phase
zokrates setup
# execute the program
zokrates compute-witness -a 3 9 // Here we usually use a root and its square
# generate a proof of computation
zokrates generate-proof
# export a solidity verifier
zokrates export-verifier
```

## Deploying Rinkeby

set metmask mnemonic `.secret` file and place it in `eth-contracts/`
`truffle migrate --network rinkeby --reset`

## Mint

- using [myetherwallet](https://www.youtube.com/watch?v=8MChn-NJJB0) didn't work
- used script (created 10 proofs manually)
  - node mint/mint.js
- https://rinkeby.etherscan.io/address/0xdca5b1399e027a45674a7dcc931df81e506f1360

## Contract info

| Contract Name      | Contract Address                           |
| ------------------ | ------------------------------------------ |
| Migrations         | 0x5f41192ea0bF3720729dae8D998Ca067E66C80fE |
| Verifier           | 0xb64c55e07E93FB67EE6bEa9C5cE414B933A7D76a |
| SolnSquareVerifier | 0xdCa5B1399e027a45674A7dCc931df81e506f1360 |

## OpenSea link's

https://testnets.opensea.io/get-listed/step-two
https://knowledge.udacity.com/questions/133570

- Marketplace Seller: https://testnets.opensea.io/collection/unidentified-contract-pdqv7iegkv
- Marketplace Buyer: https://testnets.opensea.io/0x52ff8d8ea92628a7618d5cbbaa501e4b30a43995

# Dependency

- lite-server@2.4.0
- openzeppelin-solidity@2.5.1
- solc-js@0.5.5
- solc@0.5.17
- truffle-hdwallet-provider@1.0.17
- Truffle v5.4.16 (core: 5.4.16)
- Solidity v0.5.16 (solc-js)
- Node v12.16.2
- Web3.js v1.5.3

# Project Resources

- [Remix - Solidity IDE](https://remix.ethereum.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Truffle Framework](https://truffleframework.com/)
- [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
- [Open Zeppelin ](https://openzeppelin.org/)
- [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
- [Docker](https://docs.docker.com/install/)
- [ZoKrates](https://github.com/Zokrates/ZoKrates)
