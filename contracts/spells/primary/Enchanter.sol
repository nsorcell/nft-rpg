// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;
import {ClassSpells} from "../ClassSpells.sol";
import {ICastable} from "../../interfaces/ICastable.sol";
import {Player} from "../../tokens/Player.sol";
import "../../libraries/Errors.sol";
import "hardhat/console.sol";

contract EnchanterSpells is ICastable, ClassSpells {
    Player private immutable i_player;

    mapping(uint256 => function(uint256, uint256[] memory)) private s_spells;
    string[] private s_spellsList;

    constructor(Player player) ClassSpells(player) {
        i_player = player;

        s_spells[0] = spell0;
        s_spells[1] = spell1;
        s_spellsList = ["spell0", "spell1"];
    }

    // ** SPELLS **

    function spell0(uint256 caster, uint256[] memory targets) internal {
        string memory name = getName();
        console.log(string.concat(name, "-spell0"));
    }

    function spell1(
        uint256 caster,
        uint256[] memory targets
    ) internal requireLevel(caster, 5) {
        string memory name = getName();
        console.log(string.concat(name, "-spell0"));
    }

    // ** SPELLS **

    function cast(
        uint256 spell,
        uint256 caster,
        uint256[] memory targets
    ) external override {
        s_spells[spell](caster, targets);
    }

    function getName() public pure override returns (string memory) {
        return "Enchanter";
    }

    function getSpells() public view override returns (string[] memory) {
        return s_spellsList;
    }
}
