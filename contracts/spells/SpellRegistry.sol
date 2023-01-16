// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

import {StatsLibrary} from "../libraries/Stats.sol";
import {ICastable} from "../interfaces/ICastable.sol";
import {Player} from "../tokens/Player.sol";
import {AddressArrayUtils} from "../libraries/ArrayUtils.sol";
import {ERC721Linked} from "../tokens/ERC721Linked.sol";
import {ClassLibrary} from "../libraries/Class.sol";
import "../libraries/Errors.sol";

contract SpellRegistry {
    using AddressArrayUtils for address[];

    address[5] private s_primaryClassContracts;
    address[14] private s_secondaryClassContracts;
    address[] private s_mintableSpellContracts;
    mapping(string => address) private s_proposals;

    string[] private s_spellClassNames;

    constructor(
        address[5] memory primaryClassContracts,
        address[14] memory secondaryClassContracts
    ) {
        unchecked {
            for (uint256 i = 0; i < 5; i++) {
                s_primaryClassContracts[i] = primaryClassContracts[i];
            }

            for (uint256 i = 0; i < 14; i++) {
                s_secondaryClassContracts[i] = secondaryClassContracts[i];
            }
        }
    }

    function registerSpellClassProposal(address spellContract) public {
        if (spellContract == address(0)) {
            // address cannot be zero address
            revert Unauthorized();
        }

        ICastable castable = ICastable(spellContract);

        string memory name = castable.getName();

        if (s_proposals[name] != address(0)) {
            // if proposal already exists for this, revert.
            revert Unauthorized();
        }

        if (s_mintableSpellContracts.contains(spellContract)) {
            //if mintableSpellContracts already contains contract, revert
            revert Unauthorized();
        }

        s_proposals[name] = spellContract;
    }

    function acceptSpellClass(string memory proposal) public {
        if (s_proposals[proposal] == address(0)) {
            //revert as proposal doesn't exist.
        }

        ICastable castable = ICastable(s_proposals[proposal]);

        string memory name = castable.getName();

        if (s_mintableSpellContracts.contains(address(castable))) {
            revert Unauthorized();
        }

        s_mintableSpellContracts.push(s_proposals[name]);
    }

    function getPrimaryClassContract(
        ClassLibrary.PrimaryClass primaryClass
    ) external view returns (ICastable) {
        return ICastable(s_primaryClassContracts[uint256(primaryClass)]);
    }

    function getSecondaryClassContract(
        ClassLibrary.SecondaryClass secondaryClass
    ) external view returns (ICastable) {
        if (secondaryClass == ClassLibrary.SecondaryClass.None) {
            return ICastable(address(0));
        }

        return ICastable(s_secondaryClassContracts[uint256(secondaryClass)]);
    }

    function getMintableSpellContracts()
        external
        view
        returns (address[] memory)
    {
        return s_mintableSpellContracts;
    }

    function getSpellClassNames() public view returns (string[] memory) {
        return s_spellClassNames;
    }
}
