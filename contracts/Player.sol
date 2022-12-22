// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {World} from "./World.sol";
import {IPlayer} from "./interfaces/IPlayer.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract Player is IPlayer, ERC721 {
    using Counters for Counters.Counter;

    World private immutable i_world;
    Counters.Counter private _tokenIdCounter;

    uint256 private s_tokenId = 0;
    mapping(uint256 => Stats) s_stats;

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
        s_stats[tokenId] = Stats(1, 100, 100, 1, 100, 100, 1, 100, 100, 1);
    }
}
