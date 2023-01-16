// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {Player} from "../tokens/Player.sol";
import {StatsLibrary} from "../libraries/Stats.sol";
import {ClassLibrary} from "../libraries/Class.sol";
import {ICastable} from "../interfaces/ICastable.sol";
import {ERC721Linked} from "../tokens/ERC721Linked.sol";
import {SpellRegistry} from "./SpellRegistry.sol";
import {UintArrayUtils, AddressArrayUtils, StringArrayUtils} from "../libraries/ArrayUtils.sol";
import "../libraries/Errors.sol";
import {console} from "hardhat/console.sol";

contract Spell is ERC721Linked {
    using AddressArrayUtils for address[];
    using StringArrayUtils for string[];
    using UintArrayUtils for uint256[];

    enum SpellType {
        MINTABLE,
        PRIMARY,
        SECONDARY
    }

    using Counters for Counters.Counter;

    struct SpellBook {
        string name;
        uint256 owner;
        uint256 spellIndex;
        ICastable spellContract;
    }

    Player private immutable i_player;
    SpellRegistry private immutable i_spellRegistry;

    mapping(uint256 => SpellBook) s_spells;
    Counters.Counter private s_spellId;

    constructor(
        Player player,
        SpellRegistry spellRegistry
    ) ERC721Linked("Spell", "SPELL") {
        i_player = Player(player);
        i_spellRegistry = spellRegistry;
    }

    function cast(
        uint256 spell,
        uint256[] memory targets,
        SpellType spellType
    ) external {
        (bool hasPlayer, uint caster) = i_player.getPlayerOf(msg.sender);

        if (!hasPlayer) {
            revert Unauthorized();
        }

        StatsLibrary.Attributes memory attributes = i_player.getAttributes(
            caster
        );

        if (spellType == SpellType.PRIMARY) {
            ICastable primaryClassContract = i_spellRegistry
                .getPrimaryClassContract(attributes.primaryClass);

            if (address(primaryClassContract) == address(0)) {
                //no class
            }

            primaryClassContract.cast(spell, caster, targets);

            return;
        }

        if (spellType == SpellType.SECONDARY) {
            ICastable secondaryClassContract = i_spellRegistry
                .getSecondaryClassContract(attributes.secondaryClass);

            if (address(secondaryClassContract) == address(0)) {
                //no class
            }

            secondaryClassContract.cast(spell, caster, targets);

            return;
        }

        SpellBook memory spellBook = s_spells[spell];

        address[] memory mintableSpellContracts = i_spellRegistry
            .getMintableSpellContracts();

        if (
            !mintableSpellContracts.contains(address(spellBook.spellContract))
        ) {
            // spellContract doesn't exist
            revert Unauthorized();
        }

        string[] memory spells = spellBook.spellContract.getSpells();

        (bool contains, uint256 index) = spells.indexOf(spellBook.name);

        if (!contains) {
            // the spell doesn't exist
            revert Unauthorized();
        }

        if (s_spells[spell].owner != caster) {
            // player doesn't own the spell
            revert Unauthorized();
        }

        spellBook.spellContract.cast(spell, caster, targets);
    }
}
