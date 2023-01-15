// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {GuildRegistry} from "../GuildRegistry.sol";
import {Guild} from "../Guild.sol";
import {Currency} from "./Currency.sol";
import {Player} from "./Player.sol";
import "../libraries/Errors.sol";

contract City is ERC721 {
    using Counters for Counters.Counter;

    uint256 private constant MINIMUM_GUILD_MEMBERS = 30;

    GuildRegistry private immutable i_guildRegistry;
    Currency private immutable i_currency;
    Player private immutable i_player;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => uint256) private s_entryfees;
    mapping(uint256 => mapping(uint256 => bool)) private s_occupants;

    constructor(
        GuildRegistry registry,
        Currency currency,
        Player player
    ) ERC721("City", "CITY") {
        i_guildRegistry = registry;
        i_currency = currency;
        i_player = player;
    }

    function createCity() internal {
        (bool isMember, address ofGuild) = i_guildRegistry.isMemberOfAnyGuild(
            msg.sender
        );

        if (!isMember) {
            revert Unauthorized();
        }

        Guild guild = Guild(ofGuild);

        if (!guild.isLeader(msg.sender)) {
            revert Unauthorized();
        }

        address[] memory members = guild.getMembers();

        if (members.length < MINIMUM_GUILD_MEMBERS) {
            revert Unauthorized();
        }

        uint256 tokenId = _tokenIdCounter.current();

        _tokenIdCounter.increment();

        ERC721._safeMint(msg.sender, tokenId);
    }

    function enter(uint256 city) public {
        (bool found, uint256 player) = i_player.getPlayerOf(msg.sender);

        if (!found) {
            revert Unauthorized();
        }

        if (s_occupants[city][player]) {
            // already in city
            revert Unauthorized();
        }

        uint256 entryFee = s_entryfees[city];

        if (i_currency.balanceOf(msg.sender) < entryFee) {
            revert Unauthorized();
        }

        i_currency.transferFrom(msg.sender, ownerOf(city), entryFee);

        s_occupants[city][player] = true;
    }

    function leave(uint256 city) public {
        (bool found, uint256 player) = i_player.getPlayerOf(msg.sender);

        if (!found) {
            revert Unauthorized();
        }

        if (!s_occupants[city][player]) {
            // not in city
            revert Unauthorized();
        }

        s_occupants[city][player] = false;
    }
}
