// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IManaReserve} from "./interfaces/IManaReserve.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {World} from "./World.sol";

contract ManaReserve is IManaReserve, Ownable {
    using SuperTokenV1Library for ISuperToken;

    bool private isConnected = false;
    int96 private constant INITIAL_FLOWRATE = 1;

    ISuperToken private MANAx;

    modifier requireConnected() {
        if (!isConnected) {
            revert WorldNotConnected();
        }
        _;
    }

    constructor(address world) Ownable() {
        _transferOwnership(world);
    }

    function connectWorld(ISuperToken mana) external onlyOwner {
        MANAx = mana;
        MANAx.createFlow(msg.sender, INITIAL_FLOWRATE);

        isConnected = true;
    }

    function updateManaFlow(
        int96 flowIncrease
    ) external onlyOwner requireConnected {
        MANAx.updateFlow(msg.sender, flowIncrease);
    }
}
