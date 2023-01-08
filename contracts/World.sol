// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {MANAx} from "./tokens/MANAx.sol";
import {ManaReserve} from "./ManaReserve.sol";
import {Player} from "./tokens/Player.sol";
import {IWorld} from "./interfaces/IWorld.sol";
import {Currency} from "./tokens/Currency.sol";
import "./libraries/Errors.sol";

contract World is IWorld, AccessControl {
    int96 public constant MANA_FLOW_PER_PLAYER = 1;

    bytes32 public constant CURRENCY_DISTRIBUTOR =
        keccak256("CURRENCY_DISTRIBUTOR");
    bytes32 public constant XP_DISTRIBUTOR = keccak256("XP_DISTRIBUTOR");
    bytes32 public constant MANAFLOW_MANAGER = keccak256("MANAFLOW_MANAGER");
    bytes32 public constant MANA_BURNER = keccak256("MANA_BURNER");

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

        _setupRole(MANAFLOW_MANAGER, address(player));

        manaReserve.connectWorld(mana);

        s_initialized = true;
    }

    function adjustManaFlow() external ready onlyRole(MANAFLOW_MANAGER) {
        int96 currentFlowRate = s_manaReserve.getManaFlowRate();
        s_manaReserve.updateManaFlow(currentFlowRate + MANA_FLOW_PER_PLAYER);
    }

    function burnMana(uint256 cost) external ready onlyRole(MANA_BURNER) {
        uint256 balance = s_manaX.balanceOf(address(this));
        if (balance < cost) {
            revert World_NotEnoughMana();
        }

        MANAx(payable(address(s_manaX))).burn(address(this), cost);

        emit World_ManaBurned(cost);
    }

    function awardCurrency(
        uint256 player,
        uint256 amount
    ) external ready onlyRole(CURRENCY_DISTRIBUTOR) {
        address owner = s_player.ownerOf(player);
        s_currency.transfer(owner, amount);

        emit World_CurrencyAwarded(player, amount);
    }

    function awardXP(
        uint256 player,
        uint256 amount
    ) external ready onlyRole(XP_DISTRIBUTOR) {
        s_player.updateXp(player, amount);

        emit World_XPAwarded(player, amount);
    }

    function mintCurrency() external payable ready {
        if (msg.value == 0) {
            revert World_CurrencyMustBeBacked();
        }

        uint256 amount = msg.value * i_currencyRatio;

        s_currency.mint(address(this), amount);

        emit World_CurrencyMinted(amount);
    }
}
