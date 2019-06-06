const DoaToken = artifacts.require("./DoaToken.sol");

module.exports = function(deployer) {
  const _name = "Doa Token"
  const _symbol = "DOAT"
  const _decimals = 18

  deployer.deploy(DoaToken, _name, _symbol, _decimals);
};
