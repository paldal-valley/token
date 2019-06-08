const Doajou = artifacts.require('./Doajou.sol')
require('dotenv').config()

module.exports = deployer => {
  const _tokenName = 'Doa Token'
  const _tokenSymbol = 'DOAT'
  const _tokenDecimals = 18
  const _managerAddress = process.env.MANAGER_ADDRESS

  deployer.deploy(Doajou, _managerAddress, _tokenName, _tokenSymbol, _tokenDecimals)
}
