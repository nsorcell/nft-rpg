// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {World} from "../World.sol";
import {IPlayer} from "../interfaces/tokens/IPlayer.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {UintArrayUtils} from "../libraries/ArrayUtils.sol";

contract Player is IPlayer, ERC721 {
    using Counters for Counters.Counter;
    using UintArrayUtils for uint256[];
    using SafeMath for uint256;

    uint256 private constant MAX_DISTRIBUTABLE_POINTS = 3;

    World private immutable i_world;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => Attributes) s_attributes;

    constructor(address world) ERC721("Player", "PLAYER") {
        i_world = World(world);
    }

    function create() external {
        if (balanceOf(msg.sender) > 0) {
            revert MultiplePlayersNotAllowed();
        }

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    function levelUp(uint256 player, uint256[] memory points) public {
        Attributes memory attributes = s_attributes[player];
        uint256 requiredXp = calculateXPForNextLevel(attributes.level);

        if (attributes.experience < requiredXp) {
            revert CannotLevelUp(requiredXp - attributes.experience);
        }

        uint256 remainingXp = attributes.experience - requiredXp;

        s_attributes[player].level++;
        s_attributes[player].experience = remainingXp;
    }

    function calculateXPForNextLevel(
        uint256 currentLevel
    ) public pure returns (uint256) {
        uint256 nextLevel = currentLevel + 1;
        return nextLevel.mul(nextLevel).mul(3).add(100);
    }
}
