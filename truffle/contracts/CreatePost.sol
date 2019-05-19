pragma solidity ^0.5.8;

contract DietManager {

   event PostCreated(address indexed party, uint indexed postID);
   event PostFinalized (address indexed party, uint indexed postID);


   struct Post {
       address payable writer;
   }

   Post[] public posts;

   function totalPosts() public view returns(uint) {
       return posts.length;
   }

   function createPost () public {
       _createPost(msg.sender);
   }

   function _createPost (address payable _writer) internal {
       posts.push(Post({
           writer : _writer
           }));

       emit PostCreated(_writer, posts.length-1);
   }




   function finalize(uint postID) public payable {
       Post storage post = posts[postID];
       post.writer.transfer(20);
       emit PostFinalized(msg.sender, postID);

   }


}