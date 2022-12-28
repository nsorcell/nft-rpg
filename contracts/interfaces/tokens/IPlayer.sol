// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;
import {StatsLibrary} from "../../libraries/Stats.sol";
import {ClassLibrary} from "../../libraries/Class.sol";

interface IPlayer {
    error MultiplePlayersNotAllowed();
    error InvalidAttributePoints();
    error CannotLevelUp(uint256 missingXp);

    struct Attributes {
        uint256 level;
        uint256 experience;
        ClassLibrary.PrimaryClass primaryClass;
        ClassLibrary.SecondaryClass secondaryClass;
    }
}
