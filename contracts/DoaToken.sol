pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

contract DoaToken is StandardToken, DetailedERC20 {
    uint256 public constant INITIAL_SUPPLY = 10000000000;

    constructor(string _name, string _symbol, uint8 _decimals)
        DetailedERC20(_name, _symbol, _decimals)
        public
    {
        totalSupply_ = INITIAL_SUPPLY * (10 ** uint256(decimals));
        balances[msg.sender] = totalSupply_;
        emit Transfer(address(0), msg.sender, totalSupply_);
    }

    function totalSupply() public view returns (uint256) {
        return super.totalSupply();
    }

    function balanceOf(address owner) public view returns (uint256) {
        return super.balanceOf(owner);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        return super.transfer(to, value);
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return super.allowance(owner, spender);
    }

    // from의 돈을 출금할 권리가 있는 사람이 실행한다.
    // 다른 사람이 실행하면 revert되므로 modifier를 따로 지정하지 않아도 된다.
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        return super.transferFrom(from, to ,value);
    }

    // spender에게 실행자(msg.sender)의 돈을 출금할 권리를 준다.
    // 누구나 실행 가능
    function approve(address spender, uint256 value) public returns (bool) {
        return super.approve(spender, value);
    }
}
