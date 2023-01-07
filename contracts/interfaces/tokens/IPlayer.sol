// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;
import {StatsLibrary} from "../../libraries/Stats.sol";
import {ClassLibrary} from "../../libraries/Class.sol";

interface IPlayer {
    event Player_PlayerCreated(uint256 indexed playerId);
    event Player_LevelUp(uint256 indexed playerId);
    event Player_FirstClassTransfer(
        uint256 indexed playerId,
        uint256 indexed class
    );

    event Player_SecondClassTransfer(
        uint256 indexed playerId,
        uint256 indexed class
    );

    event Player_XPReceived(uint256 indexed playerId, uint256 amount);
}
