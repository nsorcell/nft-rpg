// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;
import {ICastable} from "../../interfaces/ICastable.sol";

contract BattlemageSpells is ICastable {
    mapping(uint256 => function(uint256, uint256[] memory)) private s_spells;
    string[] private s_spellsList;

    constructor() {
        s_spells[0] = spell0;
        s_spellsList = ["spell0"];
    }

    // ** SPELLS **

    function spell0(uint256 caster, uint256[] memory targets) internal {}

    // ** SPELLS **

    function cast(
        uint256 spell,
        uint256 caster,
        uint256[] memory targets
    ) external override {
        s_spells[spell](caster, targets);
    }

    function getName() public pure override returns (string memory) {
        return "Battlemage";
    }

    function getSpells() public view override returns (string[] memory) {
        return s_spellsList;
    }
}
