pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./DoaToken.sol";

contract Doajou is Ownable, DoaToken {
    using SafeMath for uint256;

    // questioner -> questionId -> deposit amount
    mapping (address => mapping (uint32 => uint256)) public questionGuaranteeTable;

    constructor(address _manager, string _name, string _symbol, uint8 _decimals)
        DoaToken(_name, _symbol, _decimals)
        Ownable() public
    {
        manager = _manager;
    }

    address public manager;
    uint256 internal refundRevenue;

    /**
     * @dev Error messages for require statements
     */

    string internal constant INVALID_TOKEN_VALUES = 'Invalid token values';
    string internal constant NOT_ENOUGH_TOKENS = 'Not enough tokens';
    string internal constant AMOUNT_ZERO = 'Amount can not be 0';

    uint256 internal constant MAX_QUESTION_GUARANTEE = 50000;

    function getRefundRevenue() public view returns (uint256) {
        return refundRevenue;
    }

    /* for external use of mapping value */
    function getGuaranteeAmount(address questioner, uint32 questionId) public view returns (uint256) {
        return questionGuaranteeTable[questioner][questionId];
    }

    /* 질문 생성 시 guarantee 테이블에 기록 */
    function addQuestionGuarantee(uint32 questionId, uint256 guarantee) internal {
        address questioner = msg.sender;
        require(questionGuaranteeTable[questioner][questionId] == 0);

        questionGuaranteeTable[questioner][questionId] = guarantee;
    }

    /* 질문 생성 시 실행 */
    /* onlyQuestioner */
    function questionCreated(uint32 questionId, uint256 guarantee) public payable {
        address questioner = msg.sender;
        // questioner에게 guarantee 이상의 token이 있는지 확인
        require(balanceOf(questioner) >= guarantee);
        require(guarantee <= MAX_QUESTION_GUARANTEE);

        addQuestionGuarantee(questionId, guarantee);
        super.transfer(manager, guarantee);
    }

    /* 질문 삭제 시 실행 */
    /* onlyManager */
    function removeQuestion(address questioner, uint32 questionId) public {
        require(questionGuaranteeTable[questioner][questionId] != 0);

        // tokenTable 참조
        uint256 guarantee = questionGuaranteeTable[questioner][questionId];

        // 환불 금액 및 환불 수수료 책정
        uint256 refundAmount = guarantee.mul(9).div(10); // 90%
        uint256 refundFee = guarantee.div(10);

        /* transfer이 아닌 this.transfer을 사용 */
        /* this == owner */
        // questioner에게 guarantee의 90% 환불
        super.transfer(questioner, refundAmount);
        refundRevenue = refundRevenue.add(refundFee);

        // token table로부터 guarantee 차감
        questionGuaranteeTable[questioner][questionId] = 0;
    }

    //    function answerSelected() public {
    //        // tokenTable 유효성 검사한다
    //        // 검증통과시 delegator는 답변자에게 amount만큼의 토큰을 보낸다
    //        transferFrom();
    //    }

    /* manager가 refund fee로 벌어들인 token 수익을 owner에게 반환하는 함수 */
    /* onlyManager */
    function takeRefundRevenue() public {
        /* msg.sender == manager */
        super.transfer(owner, refundRevenue);
        refundRevenue = 0;
    }
}
