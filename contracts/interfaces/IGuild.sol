// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface IGuild {
    error Unauthorized();
    error CandidateNotFound();
    error AlreadyMemberOfAnotherGuild(address guild);
    error NotAMember();
    error CannotPromoteLeader();
    error CannotDemoteLeader();
    error NotInRole();
    error AlreadyInRole();
    error CannotDemoteMember();
    error InvalidRole();
    error NewLeaderMustBeDifferent();
    error NewLeaderMustBeInGuild();
    error CannotExpulseLeader();

    enum Role {
        MEMBER,
        OFFICER,
        TREASURY_MANAGER,
        LEADER
    }
}
