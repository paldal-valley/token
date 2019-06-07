pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract A is Ownable {
    constructor () Ownable() {}

    function bar () returns (address) {
        return owner;
    }
    function who () returns (address) {
        return msg.sender;
    }

//    function toString(address x) returns (string) {
//        bytes memory b = new bytes(20);
//        for (uint i = 0; i < 20; i++)
//            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
//        return string(b);
//    }
}

//it('foo test', async function() {
//console.log(await this.a.who.call({ from: _questioner }))
//console.log(await this.b.foo.call({ from: _questioner }))
//console.log(await this.b.bar.call({ from: _questioner }))
//console.log(await this.b.baz.call({ from: _questioner }))
//console.log(await this.c.foo.call({ from: _questioner }))
//console.log(await this.c.who.call({ from: _questioner }))
//
//console.log(await this.a.bar.call({ from: _questioner }))
//})
