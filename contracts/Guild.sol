// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.16;
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IGuild} from "./interfaces/IGuild.sol";
import {AddressArrayUtils} from "./libraries/ArrayUtils.sol";
import {GuildRegistry} from "./GuildRegistry.sol";
import {World} from "./World.sol";

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

        s_guildRegistry.register(address(this));
    }

    function requestJoin(address candidate) public {
        s_recruitmentRequests.push(candidate);
    }

    function denyRequest(address candidate) public {
        if (!hasRole(LEADER, msg.sender) || !hasRole(OFFICER, msg.sender)) {
            revert Unauthorized();
        }

        (bool found, uint256 index) = s_recruitmentRequests.indexOf(candidate);

        if (found) {
            s_recruitmentRequests.remove(index);
        } else {
            revert CandidateNotFound();
        }
    }

    function recruit(address candidate) public {
        if (!hasRole(LEADER, msg.sender) || !hasRole(OFFICER, msg.sender)) {
            revert Unauthorized();
        }

        if (!s_recruitmentRequests.contains(candidate)) {
            revert CandidateNotFound();
        }

        (bool member, address guild) = s_guildRegistry.isMemberOfAnyGuild(
            candidate
        );

        if (member) {
            revert AlreadyMemberOfAnotherGuild(guild);
        }

        (bool found, uint256 index) = s_recruitmentRequests.indexOf(candidate);

        if (found) {
            s_recruitmentRequests.remove(index);
        }

        _setupRole(MEMBER, candidate);
        s_memberList.push(candidate);

        s_guildRegistry.registerMember(candidate);
    }

    function expulse(address member) public onlyRole(LEADER) {
        if (member == s_leader) {
            revert CannotExpulseLeader();
        }

        (bool found, uint256 index) = s_memberList.indexOf(member);

        if (found) {
            s_memberList.remove(index);

            bytes32 currentRole = getRole(member);
            _revokeRole(currentRole, member);

            s_guildRegistry.unregisterMember(member);
        } else {
            revert NotAMember();
        }
    }

    function promoteTo(Role role, address member) public onlyRole(LEADER) {
        if (member == s_leader) {
            revert CannotPromoteLeader();
        }

        bytes32 currentRoleName = getRole(member);
        bytes32 targetRoleName = s_roles[uint256(role)];

        if (currentRoleName == targetRoleName) {
            revert AlreadyInRole();
        }

        _revokeRole(currentRoleName, member);
        _setupRole(targetRoleName, member);
    }

    function demote(address member) public onlyRole(LEADER) {
        if (member == s_leader) {
            revert CannotDemoteLeader();
        }

        bytes32 currentRole = getRole(member);

        if (currentRole == MEMBER) {
            revert CannotDemoteMember();
        }

        bytes32 targetRole = s_roles[uint256(currentRole) - 1];

        _revokeRole(currentRole, member);
        _setupRole(targetRole, member);
    }

    function transferLeadership(address newLeader) public onlyRole(LEADER) {
        if (!s_memberList.contains(newLeader)) {
            revert NewLeaderMustBeDifferent();
        }

        if (newLeader != s_leader) {
            revert NewLeaderMustBeInGuild();
        }

        s_leader = newLeader;

        (, uint256 index) = s_memberList.indexOf(s_leader);
        s_memberList.remove(index);

        _setupRole(LEADER, s_leader);
        _revokeRole(LEADER, msg.sender);
    }

    function disband() public onlyRole(LEADER) {
        for (uint256 i = 0; i < s_memberList.length; i++) {
            address member = s_memberList[i];
            bytes32 currentRole = getRole(member);
            _revokeRole(currentRole, member);
            s_guildRegistry.unregisterMember(member);
        }

        s_memberList = new address[](0);
        s_guildRegistry.unregister();
        selfdestruct(payable(s_leader));
    }

    function isMember(address account) public view returns (bool) {
        return s_memberList.contains(account);
    }

    function isLeader(address user) public view returns (bool) {
        return user == s_leader;
    }

    function getRole(address user) public view returns (bytes32) {
        unchecked {
            for (uint256 i = 0; i < 4; ) {
                if (hasRole(s_roles[i], user)) {
                    return s_roles[i];
                }
            }

            return bytes32(0);
        }
    }
}
