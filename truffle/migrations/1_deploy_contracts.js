var Faucet = artifacts.require("./Faucet.sol");
var Token = artifacts.require("./Token.sol");
var JHToken = artifacts.require("./JHToken.sol")
var JHTokenDEX = artifacts.require("JHTokenDEX")

module.exports = function(deployer) {
    deployer.deploy(Faucet).then(async () => {
        await Faucet.deployed().then(i => { FaucetDeployed = i })
        await FaucetDeployed.send(web3.utils.toWei("0.1", "ether"));
        return deployer.deploy(Token, Faucet.address);
    });
    let JHTokenDeployed;
    deployer.deploy(JHToken).then(async () => {
        await JHToken.deployed().then((i) => {
            JHTokenDeployed = i;
        })
        console.log(JHTokenDeployed.address);
        return deployer.deploy(JHTokenDEX, JHTokenDeployed.address).then(async () => {
            return JHToken.deployed();
        });
    });
};
