// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;
import {SpellDescriptor} from "./SpellDescriptor.sol";

error StackIsEmpty();

contract Stackable {
    struct StackEntry {
        uint256 spell;
        uint256 caster;
        uint256 target;
        SpellDescriptor.SpellType spellType;
    }

    mapping(bytes32 => StackEntry[]) s_stacks;

    function getStackIdOf(
        uint256 player1,
        uint256 player2
    ) public pure returns (bytes32) {
        bytes32 stackId;
        if (player1 < player2) {
            stackId = keccak256(abi.encodePacked(player1, player2));
        } else {
            stackId = keccak256(abi.encodePacked(player2, player1));
        }

        return stackId;
    }

    function getStackOf(
        uint256 player1,
        uint256 player2
    ) internal view returns (StackEntry[] memory) {
        bytes32 stackId = getStackIdOf(player1, player2);

        return s_stacks[stackId];
    }

    function pushToStack(StackEntry memory stackEntry) internal {
        bytes32 stackId = getStackIdOf(stackEntry.caster, stackEntry.target);

        s_stacks[stackId].push(stackEntry);
    }

    function popFromStack(
        uint256 player1,
        uint256 player2
    ) internal returns (StackEntry memory) {
        bytes32 stackId = getStackIdOf(player1, player2);

        StackEntry[] memory stack = s_stacks[stackId];

        if (stack.length == 0) {
            revert StackIsEmpty();
        }

        StackEntry memory lastStackEntry = stack[stack.length - 1];
        s_stacks[stackId].pop();

        return lastStackEntry;
    }

    function deleteFromStack(
        uint256 player1,
        uint256 player2,
        uint256 spell
    ) internal {
        bytes32 stackId = getStackIdOf(player1, player2);

        StackEntry[] storage stack = s_stacks[stackId];
        uint256 stackIndex;

        unchecked {
            for (uint256 i = 0; i < stack.length; i++) {
                if (stack[i].spell == spell) {
                    stackIndex = i;
                }
            }

            if (stackIndex >= stack.length) return;

            for (uint256 i = stackIndex; i < stack.length - 1; i++) {
                stack[i] = stack[i + 1];
            }

            stack.pop();
        }

        s_stacks[stackId] = stack;
    }

    function clearStack(uint256 player1, uint256 player2) internal {
        bytes32 stackId = getStackIdOf(player1, player2);

        s_stacks[stackId] = new StackEntry[](0);
    }
}
