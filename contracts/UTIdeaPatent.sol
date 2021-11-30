// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract UTIdeaPatent is ERC721Enumerable {

    struct Idea {
        string name;
        string description;
    }

    uint256 counter;

    mapping(uint256 => Idea) public tokenIdToIdeaInfo;

    constructor() ERC721("Patent Idea", "UPI") {
        counter = 0;
    }

    function createIdea(string memory _name, string memory _description) public {
        counter = counter + 1;
        Idea memory newIdea = Idea(_name, _description);
        tokenIdToIdeaInfo[counter] = newIdea;
        _mint(msg.sender, counter);
    }
    
    // Implement Task 1 Transfer Idea
    function transferIdea(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        require(msg.sender == ownerOf(_tokenId), "Operation fired by a non owner");
        //2. Use the safeTransferFrom(from, to, tokenId); function to transfer the idea
        safeTransferFrom(msg.sender, _to1, _tokenId);
    }
}