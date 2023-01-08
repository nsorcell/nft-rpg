// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SuperTokenBase} from "./SuperTokenBase.sol";

contract MANAx is SuperTokenBase, Ownable {
    function initialize(
        address factory,
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address receiver,
        bytes memory userData
    ) external onlyOwner {
        _initialize(factory, name, symbol);
        _mint(receiver, initialSupply, userData);
        _transferOwnership(receiver);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount, "0x");
    }
}
