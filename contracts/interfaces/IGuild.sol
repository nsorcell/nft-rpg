// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface IGuild {
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
