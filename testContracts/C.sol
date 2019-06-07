pragma solidity ^0.4.24;

import "./A.sol";

contract C {
    constructor (address aAdd) {
        a = A(aAdd);
    }

    // A 컨트랙트 주소 반환
    function foo() returns (address) {
        return a.who();
    }

    A public a;
}
