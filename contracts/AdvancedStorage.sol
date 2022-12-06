//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract AdvancedStorage{

    string[] public names;

    function get(uint256 position) public view returns (string memory) {
        return names[position];
    }

    function getAll() public view returns (string[] memory) {
        return names;
    }

    function getLength() public view returns (uint256){
        return names.length;
    }

    function addName(string memory name) public {
        names.push(name);
    }

    function removeLast() public{
        names.pop();
    }
}