// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface IWorld {
    event World_CurrencyAwarded(uint256 indexed player, uint256 indexed amount);
    event World_CurrencyMinted(uint256 indexed amount);
    event World_ManaBurned(uint256 indexed amount);
    event World_XPAwarded(uint256 indexed player, uint256 indexed amount);
}
