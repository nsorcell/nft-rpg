// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface IGuildRegistry {
    error AlreadyMember(address guild);
    error OnlyAllowedForGuilds();
    error OnlyAllowedForLeader();
    error GuildDoesntExist();
    error GuildAlreadyExists();
    error GuildAlreadyRegistered();
}
