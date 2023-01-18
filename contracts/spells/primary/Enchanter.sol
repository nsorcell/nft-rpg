// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;
import {SpellDescriptor} from "../SpellDescriptor.sol";
import {ClassLibrary} from "../../libraries/Class.sol";
import {ICastable} from "../../interfaces/ICastable.sol";
import {Player} from "../../tokens/Player.sol";
import "../../libraries/Errors.sol";
import "hardhat/console.sol";

contract EnchanterSpells is ICastable, SpellDescriptor {
    Player private immutable i_player;

    mapping(uint256 => function(uint256, uint256) internal returns (uint256))
        private s_spells;
    string[] private s_spellsList;

    constructor(Player player) SpellDescriptor(player) {
        i_player = player;

        s_spells[0] = spell0;
        s_spells[1] = spell1;
        s_spellsList = ["spell0", "spell1"];
    }

    // ** SPELLS **

    function spell0(
        uint256 caster,
        uint256 target
    ) internal returns (uint256 cost) {
        string memory name = getName();
        console.log(string.concat(name, "-spell0"));

        return uint256(Tier.D);
    }

    function spell1(
        uint256 caster,
        uint256 target
    ) internal requireLevel(caster, 5) returns (uint256 cost) {
        string memory name = getName();
        console.log(string.concat(name, "-spell0"));

        return uint256(Tier.C);
    }

    // ** SPELLS **

    function cast(
        uint256 spell,
        uint256 caster,
        uint256 target
    ) external override returns (uint256) {
        return s_spells[spell](caster, target);
    }

    function getName() public pure override returns (string memory) {
        return "Enchanter";
    }

    function getAssociatedClass() public pure override returns (uint256) {
        return uint256(ClassLibrary.PrimaryClass.Enchanter);
    }

    function getSpells() public view override returns (string[] memory) {
        return s_spellsList;
    }
}
