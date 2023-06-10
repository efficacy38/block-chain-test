var BlackJack = artifacts.require("./BlackJack.sol")
let JHToken = require("../build/contracts/JHToken.json")

module.exports = async function(deployer) {
    const networkId = await web3.eth.net.getId();
    const address = await JHToken.networks[networkId].address;
    console.log("??", address)
    return deployer.deploy(BlackJack, address)
};
