// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

// Common
error Unauthorized();

// Player
error Player_MultiplePlayersNotAllowed();
error Player_InvalidAttributePoints();
error Player_CannotLevelUp(uint256 missingXp);
error Player_NotEligibleForClassTransfer();
error Player_InvalidClassOption(uint256[3] validOptions);
error Player_OnlyAllowedForOwnerOf(uint256 player);
error Player_PaymentValueInvalid();

// Guild
error Guild_AlreadyInRole();
error Guild_AlreadyMemberOfAnotherGuild(address guild);
error Guild_CandidateNotFound();
error Guild_CannotExpelLeader();
error Guild_CannotChangeLeaderRole();
error Guild_InvalidRole();
error Guild_NewLeaderMustBeDifferent();
error Guild_NewLeaderMustBeInGuild();
error Guild_NotAMember();
error Guild_NotInRole();

// GuildRegistry
error GuildRegistry_AlreadyMemberOfAnotherGuild(address guild);
error GuildRegistry_OnlyAllowedForGuilds();
error GuildRegistry_OnlyAllowedForLeader();
error GuildRegistry_GuildDoesntExist();
error GuildRegistry_GuildAlreadyExists();
error GuildRegistry_GuildAlreadyRegistered();

// ManaReserve
error ManaReserve_WorldNotConnected();

// World
error World_NotInitialized();
error World_CurrencyMustBeBacked();
error World_NotEnoughMana();
