// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;
import {ICastable} from "../interfaces/ICastable.sol";
import {Player} from "../tokens/Player.sol";
import {StatsLibrary} from "../libraries/Stats.sol";
import "../libraries/Errors.sol";
import "hardhat/console.sol";

contract SpellDescriptor {
    Player private immutable i_player;

    enum SpellType {
        MINTABLE,
        PRIMARY,
        SECONDARY
    }

    enum Tier {
        E,
        D,
        C,
        B,
        A,
        S
    }

    modifier requireLevel(uint256 caster, uint256 levelRequirement) {
        StatsLibrary.Attributes memory attributes = i_player.getAttributes(
            caster
        );

        if (attributes.level < levelRequirement) {
            revert Spells_LevelNotHighEnough(levelRequirement);
        }
        _;
    }

    constructor(Player player) {
        i_player = player;
    }
}
