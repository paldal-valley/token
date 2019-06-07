pragma solidity ^0.4.24;

import "./A.sol";

contract B is A {
    // foo 호출자 주소 반환
    function foo() returns (address) {
        return super.who();
    }
    // baz 호출자 주소 반환
    function baz() returns (address) {
        return who();
    }
    // B 컨트랙트 주소 반환
    function bar() returns (address) {
        return this.who();
    }
}
