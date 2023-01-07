// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {World} from "../World.sol";
import {IPlayer} from "../interfaces/tokens/IPlayer.sol";
import {StatsLibrary} from "../libraries/Stats.sol";
import {ClassLibrary} from "../libraries/Class.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {UintArrayUtils} from "../libraries/ArrayUtils.sol";

contract Player is IPlayer, ERC721 {
    using Counters for Counters.Counter;
    using UintArrayUtils for uint256[];
    using UintArrayUtils for uint256[3];

    using SafeMath for uint256;

    uint256 private constant MAX_DISTRIBUTABLE_POINTS = 3;
    uint256 private constant FIRST_CLASS_REQUIRED_LEVEL = 5;
    uint256 private constant SECOND_CLASS_REQIRED_LEVEL = 10;
    uint256 private constant INITIAL_STAT_VALUE = 6;

    World private immutable i_world;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => uint256[6]) s_stats;
    mapping(uint256 => StatsLibrary.Attributes) s_attributes;

    constructor(address world) ERC721("Player", "PLAYER") {
        i_world = World(world);
    }

    function create() external {
        if (balanceOf(msg.sender) > 0) {
            revert MultiplePlayersNotAllowed();
        }

        uint256 tokenId = _tokenIdCounter.current();
        s_stats[tokenId] = [
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE
        ];

        StatsLibrary.Location memory location = StatsLibrary.Location(0, 0);

        s_attributes[tokenId] = StatsLibrary.Attributes(
            1,
            0,
            ClassLibrary.PrimaryClass.None,
            ClassLibrary.SecondaryClass.None,
            location
        );
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    function firstClassTransfer(
        uint256 player,
        ClassLibrary.PrimaryClass selected
    ) external {
        if (msg.sender != ownerOf(player)) {
            revert NotEligibleForClassTransfer();
        }

        if (s_attributes[player].level < FIRST_CLASS_REQUIRED_LEVEL) {
            revert NotEligibleForClassTransfer();
        }

        s_attributes[player].primaryClass = selected;
    }

    function secondClassTransfer(
        uint256 player,
        ClassLibrary.SecondaryClass selected
    ) public {
        if (msg.sender != ownerOf(player)) {
            revert NotEligibleForClassTransfer();
        }

        if (
            s_attributes[player].primaryClass == ClassLibrary.PrimaryClass.None
        ) {
            revert NotEligibleForClassTransfer();
        }

        if (s_attributes[player].level < SECOND_CLASS_REQIRED_LEVEL) {
            revert NotEligibleForClassTransfer();
        }

        uint256[3] memory options = ClassLibrary.getOptions(
            s_attributes[player].primaryClass
        );

        if (!options.contains(uint256(selected))) {
            revert InvalidClassOption(options);
        }

        s_attributes[player].secondaryClass = selected;
    }

    function levelUp(uint256 player, uint256[] memory points) public {
        if (points.sum() != MAX_DISTRIBUTABLE_POINTS) {
            revert InvalidAttributePoints();
        }

        StatsLibrary.Attributes memory attributes = s_attributes[player];
        uint256 requiredXp = StatsLibrary.calculateXPForNextLevel(
            attributes.level
        );

        if (attributes.experience < requiredXp) {
            revert CannotLevelUp(requiredXp - attributes.experience);
        }

        uint256 remainingXp = attributes.experience - requiredXp;

        s_attributes[player].level++;
        s_attributes[player].experience = remainingXp;
    }

    function getStats(
        uint256 player
    ) public view returns (StatsLibrary.StatsStruct memory) {
        return StatsLibrary.statsArrToStruct(s_stats[player]);
    }

    function getAttributes(
        uint256 player
    ) public view returns (StatsLibrary.Attributes memory) {
        return s_attributes[player];
    }
}
