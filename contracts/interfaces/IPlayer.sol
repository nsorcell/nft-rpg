// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface IPlayer {
    error MultiplePlayersNotAllowed();

    struct Stats {
        uint256 level;
        uint256 maxHealth;
        uint256 health;
        int96 healthRegen;
        uint256 maxMana;
        uint256 mana;
        int96 manaRegen;
        uint256 maxStamina;
        uint256 stamina;
        int96 staminaRegen;
    }
}
