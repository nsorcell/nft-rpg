// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {Player} from "../tokens/Player.sol";
import {World} from "../World.sol";
import {StatsLibrary} from "../libraries/Stats.sol";
import {SpellDescriptor} from "./SpellDescriptor.sol";
import {Stackable} from "./Stackable.sol";
import {ClassLibrary} from "../libraries/Class.sol";
import {ICastable} from "../interfaces/ICastable.sol";
import {ERC721Linked} from "../tokens/ERC721Linked.sol";
import {SpellRegistry} from "./SpellRegistry.sol";
import {UintArrayUtils, AddressArrayUtils, StringArrayUtils} from "../libraries/ArrayUtils.sol";
import "../libraries/Errors.sol";
import {console} from "hardhat/console.sol";

contract Spell is ERC721Linked, Stackable {
    using AddressArrayUtils for address[];
    using StringArrayUtils for string[];
    using UintArrayUtils for uint256[];

    using Counters for Counters.Counter;

    struct SpellBook {
        string name;
        uint256 owner;
        uint256 spellIndex;
        ICastable spellContract;
    }

    Player private immutable i_player;
    World private immutable i_world;
    SpellRegistry private immutable i_spellRegistry;

    mapping(uint256 => SpellBook) s_spells;
    Counters.Counter private s_spellId;

    constructor(
        Player player,
        World world,
        SpellRegistry spellRegistry
    ) ERC721Linked("Spell", "SPELL") {
        i_player = Player(player);
        i_world = world;
        i_spellRegistry = spellRegistry;
    }

    function cast(
        uint256 spell,
        uint256 target,
        SpellDescriptor.SpellType spellType
    ) external {
        (bool hasCaster, uint caster) = i_player.getPlayerOf(msg.sender);

        if (!hasCaster) {
            revert Unauthorized();
        }

        StatsLibrary.Attributes memory attributes = i_player.getAttributes(
            caster
        );

        if (spellType == SpellDescriptor.SpellType.PRIMARY) {
            ICastable primaryClassContract = i_spellRegistry
                .getPrimaryClassContract(attributes.primaryClass);

            if (
                primaryClassContract.getAssociatedClass() !=
                uint(attributes.primaryClass)
            ) {
                revert Unauthorized();
            }
        }

        if (spellType == SpellDescriptor.SpellType.SECONDARY) {
            ICastable secondaryClassContract = i_spellRegistry
                .getSecondaryClassContract(attributes.secondaryClass);

            // secondaryClass is not set yet
            if (address(secondaryClassContract) == address(0)) {
                revert Unauthorized();
            }

            // user class is different from classContract
            if (
                secondaryClassContract.getAssociatedClass() !=
                uint(attributes.secondaryClass)
            ) {
                revert Unauthorized();
            }
        }

        if (spellType == SpellDescriptor.SpellType.MINTABLE) {
            SpellBook memory spellBook = s_spells[spell];

            address[] memory mintableSpellContracts = i_spellRegistry
                .getMintableSpellContracts();

            //mintable spell contract doesn't exist
            if (
                !mintableSpellContracts.contains(
                    address(spellBook.spellContract)
                )
            ) {
                revert Unauthorized();
            }

            string[] memory spells = spellBook.spellContract.getSpells();

            (bool contains, ) = spells.indexOf(spellBook.name);

            if (!contains) {
                // the spell doesn't exist
                revert Unauthorized();
            }

            // player doesn't own the spell
            if (s_spells[spell].owner != caster) {
                revert Unauthorized();
            }
        }

        StackEntry memory stackEntry = StackEntry(
            spell,
            caster,
            target,
            spellType
        );

        pushToStack(stackEntry);
    }

    function resolve(uint256 player1, uint256 player2) external {
        
    }

    function cast(
        uint256 caster,
        uint256 spell,
        uint256 target,
        SpellDescriptor.SpellType spellType
    ) private {
        StatsLibrary.Attributes memory attributes = i_player.getAttributes(
            caster
        );

        uint256 cost;

        if (spellType == SpellDescriptor.SpellType.PRIMARY) {
            ICastable primaryClassContract = i_spellRegistry
                .getPrimaryClassContract(attributes.primaryClass);

            cost = primaryClassContract.cast(spell, caster, target);

            // burn mana

            return;
        }

        if (spellType == SpellDescriptor.SpellType.SECONDARY) {
            ICastable secondaryClassContract = i_spellRegistry
                .getSecondaryClassContract(attributes.secondaryClass);

            cost = secondaryClassContract.cast(spell, caster, target);

            return;
        }

        SpellBook memory spellBook = s_spells[spell];

        cost = spellBook.spellContract.cast(spell, caster, target);
    }
}
