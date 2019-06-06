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
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function totalSupply() public view returns (uint256) {
        super.totalSupply();
    }

    function balanceOf(address owner) public view returns (uint256) {
        super.balanceOf(owner);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        super.transfer(to, value);
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        super.allowance(owner, spender);
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        super.transferFrom(from, to ,value);
    }

    function approve(address spender, uint256 value) public returns (bool) {
        super.approve(spender, value);
    }
}
