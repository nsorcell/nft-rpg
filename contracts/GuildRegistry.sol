// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.16;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AddressArrayUtils} from "./libraries/ArrayUtils.sol";
import {IGuildRegistry} from "./interfaces/IGuildRegistry.sol";
import {Guild} from "./Guild.sol";

contract GuildRegistry is IGuildRegistry, Ownable {
    using AddressArrayUtils for address[];

    address[] s_foundingRequests;
    address[] public s_guilds;
    mapping(address => address) public s_members;

    uint256 private s_reputation = 0;

    modifier onlyGuilds() {
        if (!s_guilds.contains(msg.sender)) {
            revert IGuildRegistry_OnlyAllowedForGuilds();
        }
        _;
    }

    constructor() Ownable() {}

    function register() public {
        if (s_foundingRequests.contains(msg.sender)) {
            revert IGuildRegistry_GuildAlreadyExists();
        }

        s_foundingRequests.push(msg.sender);
        address leader = Guild(msg.sender).getLeader();

        emit GuildRegistry_GuildEvent(
            leader,
            msg.sender,
            GuildEventType.REGISTER_REQUEST_RECEIVED
        );
    }

    function accept(address guild) public onlyOwner {
        if (s_guilds.contains(guild)) {
            revert IGuildRegistry_GuildAlreadyRegistered();
        }

        (bool found, uint256 index) = s_foundingRequests.indexOf(guild);

        if (found) {
            s_foundingRequests.remove(index);
        }

        s_guilds.push(guild);
        address leader = Guild(guild).getLeader();

        emit GuildRegistry_GuildEvent(
            leader,
            guild,
            GuildEventType.REGISTER_REQUEST_ACCEPTED
        );
    }

    function unregister() public onlyGuilds {
        (bool found, uint256 index) = s_guilds.indexOf(msg.sender);

        if (found) {
            s_guilds.remove(index);
        }

        address leader = Guild(msg.sender).getLeader();

        emit GuildRegistry_GuildEvent(
            leader,
            msg.sender,
            GuildEventType.UNREGISTER_REQUEST_RECEIVED
        );
    }

    function registerMember(address candidate) public onlyGuilds {
        (bool member, address guild) = isMemberOfAnyGuild(candidate);

        if (member) {
            revert IGuildRegistry_AlreadyMemberOfAnotherGuild(guild);
        }

        if (Guild(msg.sender).isMember(candidate)) {
            s_members[candidate] = msg.sender;
        }

        emit GuildRegistry_GuildEvent(
            candidate,
            msg.sender,
            GuildEventType.REGISTER_MEMBER
        );
    }

    function unregisterMember(address member) public onlyGuilds {
        if (s_members[member] == msg.sender) {
            s_members[member] = address(0);
        }

        emit GuildRegistry_GuildEvent(
            member,
            msg.sender,
            GuildEventType.UNREGISTER_MEMBER
        );
    }

    function isMemberOfAnyGuild(
        address user
    ) public view returns (bool, address) {
        address guild = s_members[user];

        return (s_guilds.contains(guild), guild);
    }
}
