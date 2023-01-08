// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ManaReserve} from "./ManaReserve.sol";
import {Player} from "./tokens/Player.sol";
import {IWorld} from "./interfaces/IWorld.sol";
import {Currency} from "./tokens/Currency.sol";
import "./libraries/Errors.sol";

contract World is IWorld, AccessControl {
    bytes32 public constant CURRENCY_DISTRIBUTOR =
        keccak256("CURRENCY_DISTRIBUTOR");
    bytes32 public constant XP_DISTRIBUTOR = keccak256("XP_DISTRIBUTOR");

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

    constructor(uint256 currencyRatio) AccessControl() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        i_currencyRatio = currencyRatio;
    }

    function initialize(
        Player player,
        ISuperToken mana,
        ManaReserve manaReserve,
        Currency currency
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        s_player = player;
        s_manaX = mana;
        s_manaReserve = manaReserve;
        s_currency = currency;

        manaReserve.connectWorld(mana);

        s_initialized = true;
    }

    function awardCurrency(
        address to,
        uint256 amount
    ) public ready onlyRole(CURRENCY_DISTRIBUTOR) {
        s_currency.transfer(to, amount);
    }

    function awardXP(
        uint256 player,
        uint256 amount
    ) public ready onlyRole(XP_DISTRIBUTOR) {
        s_player.updateXp(player, amount);
    }

    function mintCurrency() public payable ready {
        if (msg.value == 0) {
            revert World_CurrencyMustBeBacked();
        }

        s_currency.mint(address(this), msg.value * i_currencyRatio);
    }
}
