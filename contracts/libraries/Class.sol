// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;
import {StatsLibrary} from "./Stats.sol";

library ClassLibrary {
    enum PrimaryClass {
        Warrior,
        Mage,
        Rogue,
        Guardian,
        Enchanter,
        None
    }

    enum SecondaryClass {
        Reaper,
        Duelist,
        Harlequin,
        Arcanist,
        Battlemage,
        Dreamweaver,
        Stalker,
        Trickster,
        Explorer,
        Titan,
        Spellbreaker,
        Hexer,
        Voidwalker,
        Prophet,
        None
    }

    function getOptions(
        PrimaryClass primary
    ) public pure returns (uint256[3] memory) {
        uint256[3][5] memory options = [
            [
                uint256(SecondaryClass.Reaper),
                uint256(SecondaryClass.Duelist),
                uint256(SecondaryClass.Harlequin)
            ],
            [
                uint256(SecondaryClass.Arcanist),
                uint256(SecondaryClass.Battlemage),
                uint256(SecondaryClass.Dreamweaver)
            ],
            [
                uint256(SecondaryClass.Stalker),
                uint256(SecondaryClass.Trickster),
                uint256(SecondaryClass.Explorer)
            ],
            [
                uint256(SecondaryClass.Titan),
                uint256(SecondaryClass.Spellbreaker),
                uint256(SecondaryClass.None)
            ],
            [
                uint256(SecondaryClass.Hexer),
                uint256(SecondaryClass.Voidwalker),
                uint256(SecondaryClass.Prophet)
            ]
        ];

        return options[uint256(primary)];
    }

    function getMarkers(
        PrimaryClass primary,
        SecondaryClass secondary
    ) public pure returns (StatsLibrary.Stats[2] memory) {
        if (primary == PrimaryClass.None) {
            return [StatsLibrary.Stats.VOID, StatsLibrary.Stats.VOID];
        }

        StatsLibrary.Stats[5] memory primaryMarkers;
        primaryMarkers[uint256(PrimaryClass.Warrior)] = StatsLibrary
            .Stats
            .STRENGTH;
        primaryMarkers[uint256(PrimaryClass.Mage)] = StatsLibrary
            .Stats
            .INTELLECT;
        primaryMarkers[uint256(PrimaryClass.Rogue)] = StatsLibrary
            .Stats
            .DEXTERTY;
        primaryMarkers[uint256(PrimaryClass.Guardian)] = StatsLibrary
            .Stats
            .CONSTITUTION;
        primaryMarkers[uint256(PrimaryClass.Enchanter)] = StatsLibrary
            .Stats
            .WIT;

        if (secondary == SecondaryClass.None) {
            return [primaryMarkers[uint256(primary)], StatsLibrary.Stats.VOID];
        }

        StatsLibrary.Stats[14] memory secondaryMarkers;

        // Warrior
        secondaryMarkers[uint256(SecondaryClass.Reaper)] = StatsLibrary
            .Stats
            .DEXTERTY;
        secondaryMarkers[uint256(SecondaryClass.Duelist)] = StatsLibrary
            .Stats
            .CONSTITUTION;
        secondaryMarkers[uint256(SecondaryClass.Harlequin)] = StatsLibrary
            .Stats
            .LUCK;

        // Mage
        secondaryMarkers[uint256(SecondaryClass.Arcanist)] = StatsLibrary
            .Stats
            .WIT;
        secondaryMarkers[uint256(SecondaryClass.Battlemage)] = StatsLibrary
            .Stats
            .CONSTITUTION;
        secondaryMarkers[uint256(SecondaryClass.Dreamweaver)] = StatsLibrary
            .Stats
            .LUCK;

        // Rogue
        secondaryMarkers[uint256(SecondaryClass.Stalker)] = StatsLibrary
            .Stats
            .STRENGTH;
        secondaryMarkers[uint256(SecondaryClass.Trickster)] = StatsLibrary
            .Stats
            .WIT;
        secondaryMarkers[uint256(SecondaryClass.Explorer)] = StatsLibrary
            .Stats
            .LUCK;

        // Guardian
        secondaryMarkers[uint256(SecondaryClass.Titan)] = StatsLibrary
            .Stats
            .STRENGTH;
        secondaryMarkers[uint256(SecondaryClass.Spellbreaker)] = StatsLibrary
            .Stats
            .INTELLECT;

        // Enchanter
        secondaryMarkers[uint256(SecondaryClass.Hexer)] = StatsLibrary
            .Stats
            .STRENGTH;
        secondaryMarkers[uint256(SecondaryClass.Voidwalker)] = StatsLibrary
            .Stats
            .INTELLECT;
        secondaryMarkers[uint256(SecondaryClass.Prophet)] = StatsLibrary
            .Stats
            .LUCK;

        return [
            primaryMarkers[uint256(primary)],
            secondaryMarkers[uint256(secondary)]
        ];
    }
}
