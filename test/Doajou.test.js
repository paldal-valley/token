const Doajou = artifacts.require('Doajou')
const { expectThrow } = require('openzeppelin-solidity/test/helpers/expectThrow')
const { EVMRevert } = require('openzeppelin-solidity/test/helpers/EVMRevert')
const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('Doajou', ([
  _owner,
  _manager,
  _questioner,
  _answerer,
  ...accounts
]) => {
  describe('DOAJOU TEST', function() {
    const _tokenName = 'Doa Token'
    const _tokenSymbol = 'DOAT'
    const _tokenDecimals = 18

    const QUESTIONER_BALANCE = 100000
    const ANSWERER_BALANCE = 100000

    beforeEach(async function() {
      this.doajou = await Doajou.new(
        _manager,
        _tokenName, _tokenSymbol, _tokenDecimals,
        { from: _owner }
      )

      await this.doajou.transfer(_questioner, QUESTIONER_BALANCE, { from: _owner })
      await this.doajou.transfer(_answerer, ANSWERER_BALANCE, { from: _owner })
    })

    it('has the correct owner', async function() {
      const owner = await this.doajou.owner()
      owner.should.equal(_owner)
    })

    it('has the correct manager', async function() {
      const manager = await this.doajou.manager()
      manager.should.equal(_manager)
    })

    it('create question correctly', async function() {
      /* create question */
      const GUARANTEE = 1000
      const QUESTION_ID = 33
      await this.doajou.questionCreated(QUESTION_ID, GUARANTEE, { from: _questioner })

      // manager에게 송금 확인 및 개런티 테이블 확인
      const managerBalance = await this.doajou.balanceOf(_manager)
      managerBalance.should.be.bignumber.equal(GUARANTEE)

      const questionerBalance = await this.doajou.balanceOf(_questioner)
      questionerBalance.should.be.bignumber.equal(QUESTIONER_BALANCE - GUARANTEE)

      const guaranteeAmount = await this.doajou.getQuestionGuarantee(QUESTION_ID)
      guaranteeAmount.should.be.bignumber.equal(GUARANTEE)
    })

    it('exceed guarantee exceeds max value', async function() {
      const GUARANTEE_TOO_BIG = 50001
      const QUESTION_ID = 33

      await expectThrow(
        this.doajou.questionCreated(QUESTION_ID, GUARANTEE_TOO_BIG, { from: _questioner }),
        EVMRevert,
      )
    })

    it('cannot arbitrarily change guarantee amount on an existing questionId', async function() {
      const GUARANTEE = 1000
      const QUESTION_ID = 33

      await this.doajou.questionCreated(QUESTION_ID, GUARANTEE, { from: _questioner })

      await expectThrow(
        this.doajou.questionCreated(QUESTION_ID, GUARANTEE, { from: _questioner }),
        EVMRevert,
      )
    })

    it('remove question correctly', async function() {
      const GUARANTEE = 1000
      const QUESTION_ID = 33

      // 질문 등록
      await this.doajou.questionCreated(QUESTION_ID, GUARANTEE, { from: _questioner })

      await this.doajou.removeQuestion(QUESTION_ID, { from: _manager })

      // guarantee의 90% 환불
      const questionerBalance = await this.doajou.balanceOf(_questioner)
      questionerBalance.should.be.bignumber.equal(QUESTIONER_BALANCE - (GUARANTEE * 0.1))

      const refundRevenue = await this.doajou.getRefundRevenue()
      refundRevenue.should.be.bignumber.equal(GUARANTEE * 0.1)
    })

    it('', async function() {
      // 질문 삭제후 같은 questionId로 질문을 올릴 수 있어야 함
      // 질문 생성 없이 질문 삭제가 일어나면 안됨
    })
  })
})
