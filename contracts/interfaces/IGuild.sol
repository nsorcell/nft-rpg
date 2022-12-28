// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface IGuild {
    error IGuild_AlreadyInRole();
    error IGuild_AlreadyMemberOfAnotherGuild(address guild);
    error IGuild_CandidateNotFound();
    error IGuild_CannotExpelLeader();
    error IGuild_CannotChangeLeaderRole();
    error IGuild_InvalidRole();
    error IGuild_NewLeaderMustBeDifferent();
    error IGuild_NewLeaderMustBeInGuild();
    error IGuild_NotAMember();
    error IGuild_NotInRole();
    error IGuild_Unauthorized();

    enum Role {
        MEMBER,
        OFFICER,
        TREASURY_MANAGER,
        LEADER
    }

    event Guild_Disbanded();
    event Guild_JoinAccepted(address indexed candidate);
    event Guild_JoinDenied(address indexed candidate);
    event Guild_JoinRequested(address indexed candidate);
    event Guild_LeadershipTransferred(
        address indexed oldLeader,
        address indexed newLeader
    );
    event Guild_MemberExpelled(address indexed member);
    event Guild_RoleAssigned(address indexed member, Role indexed role);
}
