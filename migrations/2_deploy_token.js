const Doajou = artifacts.require('./Doajou.sol')

module.exports = deployer => {
  const _tokenName = 'Doa Token'
  const _tokenSymbol = 'DOAT'
  const _tokenDecimals = 18
  const _managerAddress = '0x77a52a338113fC6690cFF6441C4c6d45907670Ae'

  deployer.deploy(Doajou, _managerAddress, _tokenName, _tokenSymbol, _tokenDecimals)
}
