var Faucet = artifacts.require("./Faucet.sol");
var Token = artifacts.require("./Token.sol");

module.exports = function (deployer) {
    deployer.deploy(Faucet).then(async () => {
        await Faucet.deployed().then(i => {FaucetDeployed = i})
        await FaucetDeployed.send(web3.utils.toWei("1","ether"));
        return deployer.deploy(Token, Faucet.address);
    });
};
