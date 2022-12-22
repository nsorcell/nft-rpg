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

    modifier onlyGuilds() {
        if (!s_guilds.contains(msg.sender)) {
            revert OnlyAllowedForGuilds();
        }
        _;
    }

    constructor() Ownable() {}

    function register(address guild) public {
        if (s_foundingRequests.contains(guild)) {
            revert GuildAlreadyExists();
        }

        s_foundingRequests.push(guild);
    }

    function unregister() public onlyGuilds {
        (bool found, uint256 index) = s_guilds.indexOf(msg.sender);

        if (found) {
            s_guilds.remove(index);
        }
    }

    function accept(address guild) public onlyOwner {
        if (s_guilds.contains(guild)) {
            revert GuildAlreadyRegistered();
        }

        (bool found, uint256 index) = s_foundingRequests.indexOf(guild);

        if (found) {
            s_foundingRequests.remove(index);
        }

        s_guilds.push(guild);
    }

    function registerMember(address candidate) public onlyGuilds {
        (bool member, address guild) = isMemberOfAnyGuild(candidate);

        if (member) {
            revert AlreadyMember(guild);
        }

        if (Guild(msg.sender).isMember(candidate)) {
            s_members[candidate] = msg.sender;
        }
    }

    function unregisterMember(address member) public onlyGuilds {
        if (s_members[member] == msg.sender) {
            s_members[member] = address(0);
        }
    }

    function isMemberOfAnyGuild(
        address user
    ) public view returns (bool, address) {
        address guild = s_members[user];

        return (s_guilds.contains(guild), guild);
    }
}
