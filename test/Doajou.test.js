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

    const WELCOME_TOKEN_AMOUNT = 1000 * Math.pow(10, _tokenDecimals)
    const QUESTIONER_BALANCE = 10000 * Math.pow(10, _tokenDecimals)
    const ANSWERER_BALANCE = 10000 * Math.pow(10, _tokenDecimals)

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

    it('offer welcome token to newbie correctly', async function() {
      let balance = await this.doajou.balanceOf(accounts[0])
      balance.should.be.bignumber.equal(0)

      await this.doajou.offerWelcomeToken(accounts[0], { from: _owner })

      balance = await this.doajou.balanceOf(accounts[0])
      balance.should.be.bignumber.equal(WELCOME_TOKEN_AMOUNT)
    })

    it('cannot give same user the welcome token twice', async function() {
      await this.doajou.offerWelcomeToken(accounts[0], { from: _owner })
      await expectThrow (
        this.doajou.offerWelcomeToken(accounts[0], { from: _owner }),
        EVMRevert
      )
    })

    it('create question correctly', async function() {
      /* create question */
      const GUARANTEE = 1000 * Math.pow(10, _tokenDecimals)
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

    it('cannot exceed max guarantee value', async function() {
      const GUARANTEE_TOO_BIG = 50001 * Math.pow(10, _tokenDecimals)
      const QUESTION_ID = 33

      await expectThrow(
        this.doajou.questionCreated(QUESTION_ID, GUARANTEE_TOO_BIG, { from: _questioner }),
        EVMRevert,
      )
    })

    it('cannot arbitrarily change guarantee amount on an existing questionId', async function() {
      const GUARANTEE = 1000 * Math.pow(10, _tokenDecimals)
      const QUESTION_ID = 33

      await this.doajou.questionCreated(QUESTION_ID, GUARANTEE, { from: _questioner })

      await expectThrow(
        this.doajou.questionCreated(QUESTION_ID, GUARANTEE, { from: _questioner }),
        EVMRevert,
      )
    })

    it('remove question correctly', async function() {
      const GUARANTEE = 1000 * Math.pow(10, _tokenDecimals)
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

    it('cannot remove the question never created', async function() {
      const QUESTION_ID = 33

      await expectThrow(
        this.doajou.removeQuestion(QUESTION_ID, { _manager }),
        EVMRevert
      )
    })

    it('answer question correctly', async function() {
      const GUARANTEE = 1000 * Math.pow(10, _tokenDecimals)
      const QUESTION_ID = 33

      // 질문 등록
      await this.doajou.questionCreated(QUESTION_ID, GUARANTEE, { from: _questioner })

      await this.doajou.answerSelected(QUESTION_ID, _answerer, { from: _manager })

      const questionerBalance = await this.doajou.balanceOf(_questioner)
      questionerBalance.should.be.bignumber.equal(QUESTIONER_BALANCE - GUARANTEE)

      const answererBalance = await this.doajou.balanceOf(_answerer)
      answererBalance.should.be.bignumber.equal(ANSWERER_BALANCE + GUARANTEE)

      const questionGuarantee = await this.doajou.getQuestionGuarantee(QUESTION_ID)
      questionGuarantee.should.be.bignumber.equal(0)

      const answerSelected = await this.doajou.getSelectedAnswerer(QUESTION_ID)
      answerSelected.should.be.equal(_answerer)
    })

    it('connot answer the question never created', async function() {
      const QUESTION_ID = 33
      await expectThrow (
        this.doajou.answerSelected(QUESTION_ID, _answerer),
        EVMRevert
      )
    })
  })
})
