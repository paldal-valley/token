pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./DoaToken.sol";

contract TokenManager is Ownable {
    mapping (address => uint256) private tokenTable;

    constructor(address _manager, address _tokenAddress)
        Ownable() public {
        tokenInst = DoaToken(_tokenAddress);
    }

    DoaToken public tokenInst;

    function createQuestion() public {
        // transfer로 delegator에게 토큰 보낸다.
        // tokenTable에 해당 내용 작성한다.
    }

    // approve 사용
    function answerSelected() public {
        // tokenTable 유효성 검사한다
        // 검증통과시 delegator는 답변자에게 amount만큼의 토큰을 보낸다
        tokenInst.transferFrom();
    }

    function removeQuestion() public {

    }
}
