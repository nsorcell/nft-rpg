// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ManaReserve} from "./ManaReserve.sol";
import {Player} from "./Player.sol";
import {IWorld} from "./interfaces/IWorld.sol";

contract World is IWorld, Ownable {
    bool private s_initialized = false;

    Player private s_player;
    ISuperToken private s_manaX;
    ManaReserve private s_manaReserve;

    modifier ready() {
        if (!s_initialized) {
            revert NotInitialized();
        }
        _;
    }

    modifier onlyPlayer() {
        if (msg.sender != address(s_player)) {
            revert Unauthorized();
        }
        _;
    }

    constructor() Ownable() {}

    function initialize(
        Player player,
        ISuperToken mana,
        ManaReserve manaReserve
    ) external onlyOwner {
        s_player = player;
        s_manaX = mana;
        s_manaReserve = manaReserve;

        manaReserve.connectWorld(mana);

        s_initialized = true;
    }
}
