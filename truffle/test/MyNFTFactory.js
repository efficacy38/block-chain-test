// ./test/ContractFactory.js
const ContractFactory = artifacts.require("MyNFT");

contract("ContractFactory", () => {
  it("...should deploy and successfully call createInstance using the method's provided gas estimate", async () => {
    const contractFactoryInstance = await ContractFactory.new();

    const gasEstimate = await contractFactoryInstance.createInstance.estimateGas();
    // consoe.log("gas Estimate: ", gasEstimate);

    const tx = await contractFactoryInstance.createInstance({
      gas: gasEstimate
    });
    console.log(`gas Estimate: ${gasEstimate}`);
    assert(tx);
  });
});

