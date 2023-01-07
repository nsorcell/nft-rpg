// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ManaReserve} from "./ManaReserve.sol";
import {Player} from "./tokens/Player.sol";
import {IWorld} from "./interfaces/IWorld.sol";
import {Currency} from "./tokens/Currency.sol";
import "./libraries/Errors.sol";

contract World is IWorld, Ownable {
    uint256 private immutable i_currencyRatio;

    bool private s_initialized = false;

    Player private s_player;
    ISuperToken private s_manaX;
    ManaReserve private s_manaReserve;
    Currency private s_currency;

    modifier ready() {
        if (!s_initialized) {
            revert World_NotInitialized();
        }
        _;
    }

    modifier onlyPlayer() {
        if (msg.sender != address(s_player)) {
            revert World_Unauthorized();
        }
        _;
    }

    constructor(uint256 currencyRatio) Ownable() {
        i_currencyRatio = currencyRatio;
    }

    function initialize(
        Player player,
        ISuperToken mana,
        ManaReserve manaReserve,
        Currency currency
    ) external onlyOwner {
        s_player = player;
        s_manaX = mana;
        s_manaReserve = manaReserve;
        s_currency = currency;

        manaReserve.connectWorld(mana);

        s_initialized = true;
    }

    function mintCurrency() public payable ready {
        s_currency.mint(address(this), msg.value * i_currencyRatio);
    }
}
