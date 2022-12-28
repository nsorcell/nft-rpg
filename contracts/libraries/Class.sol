// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;
import {StatsLibrary} from "./Stats.sol";

library ClassLibrary {
    enum PrimaryClass {
        Warrior,
        Mage,
        Rogue,
        Guardian,
        Enchanter
    }

    enum SecondaryClass {
        Berserker,
        Jester,
        Arcanist,
        Dreamweaver,
        Trickster,
        Explorer,
        Colossus,
        Spellbreaker,
        Hexer,
        Prophet,
        None
    }

    function getOptions(
        PrimaryClass primary
    ) public pure returns (uint256[2] memory) {
        uint256[2][5] memory options = [
            [uint256(SecondaryClass.Berserker), uint256(SecondaryClass.Jester)],
            [
                uint256(SecondaryClass.Arcanist),
                uint256(SecondaryClass.Dreamweaver)
            ],
            [
                uint256(SecondaryClass.Trickster),
                uint256(SecondaryClass.Explorer)
            ],
            [
                uint256(SecondaryClass.Colossus),
                uint256(SecondaryClass.Spellbreaker)
            ],
            [uint256(SecondaryClass.Hexer), uint256(SecondaryClass.Prophet)]
        ];

        return options[uint256(primary)];
    }

    function getPrimaryMarker(
        PrimaryClass primary
    ) public pure returns (StatsLibrary.Stats) {
        StatsLibrary.Stats[5] memory primaryMarkers;
        primaryMarkers[uint256(PrimaryClass.Warrior)] = StatsLibrary
            .Stats
            .STRENGTH;
        primaryMarkers[uint256(PrimaryClass.Mage)] = StatsLibrary
            .Stats
            .INTELLIGENCE;
        primaryMarkers[uint256(PrimaryClass.Rogue)] = StatsLibrary
            .Stats
            .DEXTERTY;
        primaryMarkers[uint256(PrimaryClass.Guardian)] = StatsLibrary
            .Stats
            .CONSTITUTION;
        primaryMarkers[uint256(PrimaryClass.Enchanter)] = StatsLibrary
            .Stats
            .WIT;

        return primaryMarkers[uint256(primary)];
    }

    function getAllMarkers(
        SecondaryClass secondary
    ) public pure returns (StatsLibrary.Stats[2] memory) {
        StatsLibrary.Stats[2][10] memory secondaryMarkers;
        // Warrior
        secondaryMarkers[uint256(SecondaryClass.Berserker)] = [
            StatsLibrary.Stats.STRENGTH,
            StatsLibrary.Stats.DEXTERTY
        ];
        secondaryMarkers[uint256(SecondaryClass.Jester)] = [
            StatsLibrary.Stats.STRENGTH,
            StatsLibrary.Stats.LUCK
        ];

        // Mage
        secondaryMarkers[uint256(SecondaryClass.Arcanist)] = [
            StatsLibrary.Stats.INTELLIGENCE,
            StatsLibrary.Stats.WIT
        ];
        secondaryMarkers[uint256(SecondaryClass.Arcanist)] = [
            StatsLibrary.Stats.INTELLIGENCE,
            StatsLibrary.Stats.LUCK
        ];

        // Rogue
        secondaryMarkers[uint256(SecondaryClass.Trickster)] = [
            StatsLibrary.Stats.DEXTERTY,
            StatsLibrary.Stats.WIT
        ];
        secondaryMarkers[uint256(SecondaryClass.Explorer)] = [
            StatsLibrary.Stats.DEXTERTY,
            StatsLibrary.Stats.LUCK
        ];

        // Guardian
        secondaryMarkers[uint256(SecondaryClass.Colossus)] = [
            StatsLibrary.Stats.CONSTITUTION,
            StatsLibrary.Stats.STRENGTH
        ];
        secondaryMarkers[uint256(SecondaryClass.Explorer)] = [
            StatsLibrary.Stats.CONSTITUTION,
            StatsLibrary.Stats.INTELLIGENCE
        ];

        // Enchanter
        secondaryMarkers[uint256(SecondaryClass.Hexer)] = [
            StatsLibrary.Stats.WIT,
            StatsLibrary.Stats.STRENGTH
        ];
        secondaryMarkers[uint256(SecondaryClass.Prophet)] = [
            StatsLibrary.Stats.WIT,
            StatsLibrary.Stats.LUCK
        ];

        return secondaryMarkers[uint256(secondary)];
    }
}
