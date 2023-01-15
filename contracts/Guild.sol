// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.16;
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Player} from "./tokens/Player.sol";
import {IGuild} from "./interfaces/IGuild.sol";
import {AddressArrayUtils} from "./libraries/ArrayUtils.sol";
import {GuildRegistry} from "./GuildRegistry.sol";
import {World} from "./World.sol";
import "./libraries/Errors.sol";

contract Guild is IGuild, AccessControl {
    using AddressArrayUtils for address[];

    bytes32 public constant LEADER = keccak256("LEADER");
    bytes32 public constant TREASURY_MANAGER = keccak256("TREASURY_MANAGER");
    bytes32 public constant OFFICER = keccak256("OFFICER");
    bytes32 public constant MEMBER = keccak256("MEMBER");

    string private s_name;
    address private s_leader;
    address[] private s_memberList;
    address[] private s_recruitmentRequests;

    GuildRegistry private s_guildRegistry;

    mapping(uint256 => bytes32) private s_roles;

    constructor(GuildRegistry registry, string memory name) {
        s_name = name;
        s_leader = msg.sender;
        s_guildRegistry = registry;

        _setRoleAdmin(LEADER, LEADER);
        _setRoleAdmin(OFFICER, LEADER);
        _setRoleAdmin(TREASURY_MANAGER, LEADER);
        _setRoleAdmin(MEMBER, OFFICER);

        _setupRole(LEADER, s_leader);

        s_roles[uint256(Role.LEADER)] = LEADER;
        s_roles[uint256(Role.TREASURY_MANAGER)] = TREASURY_MANAGER;
        s_roles[uint256(Role.OFFICER)] = OFFICER;
        s_roles[uint256(Role.MEMBER)] = MEMBER;

        s_memberList.push(s_leader);

        s_guildRegistry.register();
    }

    function requestJoin(address candidate) external {
        s_recruitmentRequests.push(candidate);

        emit Guild_JoinRequested(candidate);
    }

    function denyRequest(address candidate) external {
        if (!hasRole(LEADER, msg.sender) || !hasRole(OFFICER, msg.sender)) {
            revert Unauthorized();
        }

        (bool found, uint256 index) = s_recruitmentRequests.indexOf(candidate);

        if (found) {
            s_recruitmentRequests.remove(index);

            emit Guild_JoinDenied(candidate);
        } else {
            revert Guild_CandidateNotFound();
        }
    }

    function recruit(address candidate) external {
        if (!hasRole(LEADER, msg.sender) || !hasRole(OFFICER, msg.sender)) {
            revert Unauthorized();
        }

        (bool found, uint256 index) = s_recruitmentRequests.indexOf(candidate);

        if (!found) {
            revert Guild_CandidateNotFound();
        }

        (bool member, address guild) = s_guildRegistry.isMemberOfAnyGuild(
            candidate
        );

        if (member) {
            revert Guild_AlreadyMemberOfAnotherGuild(guild);
        }

        s_recruitmentRequests.remove(index);

        _setupRole(MEMBER, candidate);
        s_memberList.push(candidate);
        s_guildRegistry.registerMember(candidate);

        emit Guild_JoinAccepted(candidate);
    }

    function expel(address member) external onlyRole(LEADER) {
        if (member == s_leader) {
            revert Guild_CannotExpelLeader();
        }

        (bool found, uint256 index) = s_memberList.indexOf(member);

        if (found) {
            s_memberList.remove(index);

            bytes32 currentRole = getRole(member);
            _revokeRole(currentRole, member);

            s_guildRegistry.unregisterMember(member);

            emit Guild_MemberExpelled(member);
        } else {
            revert Guild_NotAMember();
        }
    }

    function assignRole(Role role, address member) external onlyRole(LEADER) {
        if (member == s_leader) {
            revert Guild_CannotChangeLeaderRole();
        }

        bytes32 currentRoleName = getRole(member);
        bytes32 targetRoleName = s_roles[uint256(role)];

        if (currentRoleName == targetRoleName) {
            revert Guild_AlreadyInRole();
        }

        _revokeRole(currentRoleName, member);
        _setupRole(targetRoleName, member);

        emit Guild_RoleAssigned(member, role);
    }

    function transferLeadership(address newLeader) external onlyRole(LEADER) {
        (bool found, uint256 index) = s_memberList.indexOf(s_leader);

        if (!found) {
            revert Guild_NewLeaderMustBeInGuild();
        }

        if (newLeader != s_leader) {
            revert Guild_NewLeaderMustBeDifferent();
        }

        s_memberList.remove(index);

        address oldLeader = s_leader;
        s_leader = newLeader;

        _setupRole(LEADER, s_leader);
        _revokeRole(LEADER, msg.sender);

        emit Guild_LeadershipTransferred(oldLeader, newLeader);
    }

    function disband() external onlyRole(LEADER) {
        for (uint256 i = 0; i < s_memberList.length; i++) {
            address member = s_memberList[i];
            bytes32 currentRole = getRole(member);
            _revokeRole(currentRole, member);
            s_guildRegistry.unregisterMember(member);
        }

        s_memberList = new address[](0);
        s_guildRegistry.unregister();

        emit Guild_Disbanded();

        selfdestruct(payable(s_leader));
    }

    function isMember(address account) external view returns (bool) {
        return s_memberList.contains(account);
    }

    function isLeader(address user) external view returns (bool) {
        return user == s_leader;
    }

    function getName() external view returns (string memory) {
        return s_name;
    }

    function getLeader() external view returns (address) {
        return s_leader;
    }

    function getMembers() external view returns (address[] memory) {
        return s_memberList;
    }

    function getRecruitmentRequests() external view returns (address[] memory) {
        return s_recruitmentRequests;
    }

    function getRole(address user) public view returns (bytes32) {
        unchecked {
            for (uint256 i = 0; i < uint256(Role.LEADER) + 1; i++) {
                if (hasRole(s_roles[i], user)) {
                    return s_roles[i];
                }
            }

            return bytes32(0);
        }
    }
}
