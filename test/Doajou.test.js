const Doajou = artifacts.require('Doajou')
const DoaToken = artifacts.require('DoaToken')
const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('Doajou', ([
  _owner,
  _manager,
  _sender,
  _receiver,
  ...accounts
]) => {
  describe('doajou test', function() {
    const _name = 'Doa Token'
    const _symbol = 'DOAT'
    const _decimals = 18

    beforeEach(async function() {
      this.token = await DoaToken.new(_name, _symbol, _decimals, {
        from: _owner
      })
      this.doajou = await Doajou(this.token.address, {
        from: _owner
      })
    })

    it('has the correct owner', async function() {
      const owner = await this.token.owner()
      owner.should.equal(_owner)
      // const value = new BN(1)
      // const value = 100000
      // // await this.token.transfer(receiver, value, { from: sender })
      //
      // // const receiverBalanceBN = await this.token.balanceOf(receiver)
      // // receiverBalanceBN.should.be.bignumber.equal(value)
      //
      // await this.manager.foo({ from: owner })
    })
  })
})
