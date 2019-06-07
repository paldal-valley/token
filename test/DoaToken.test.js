const DoaToken = artifacts.require('DoaToken')
const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('DoaToken', ([_owner, ...accounts]) => {
  describe('token attributes', function() {
    const _name = 'Doa Token'
    const _symbol = 'DOAT'
    const _decimals = 18

    beforeEach(async function() {
      this.token = await DoaToken.new(_name, _symbol, _decimals, {
        from: _owner
      })
    })

    it('has the correct name', async function() {
      const name = await this.token.name()
      name.should.equal(_name)
    })

    it('has the correct symbol', async function() {
      const symbol = await this.token.symbol()
      symbol.should.equal(_symbol)
    })

    it('has the correct decimals', async function() {
      const decimals = await this.token.decimals()
      decimals.should.be.bignumber.equal(_decimals)
    })

    // TODO: transfer, transferFrom 테스트 추가
  })
})
