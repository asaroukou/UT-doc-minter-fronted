// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocDex {
    struct Document {
        string name;
        string hashString;
    }

    mapping(address => Document[]) public documentStorage;

    constructor() {}

    function addDocument(string memory _name, string memory _hash) public {
        Document memory doc = Document(_name, _hash);
        documentStorage[msg.sender].push(doc);
    }

    function getDocument(address owner, uint256 index)
        public
        view
        returns (string memory name, string memory hashString)
    {
        Document memory doc = documentStorage[owner][index];
        return (doc.name, doc.hashString);
    }

    function getOwnerDocumentsCount() public view returns (uint256) {
        return documentStorage[msg.sender].length;
    }

    function getDocumentsCount(address owner) public view returns (uint256) {
        return documentStorage[owner].length;
    }

    function removeOwnerDocument(uint256 index) public {
        if (index >= documentStorage[msg.sender].length) return;
        delete documentStorage[msg.sender][index];
    }
}
