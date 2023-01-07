// SPDX-License-Identifier:MIT
pragma solidity ^0.8.16;

library AddressArrayUtils {
    function contains(
        address[] memory array,
        address addr
    ) public pure returns (bool) {
        unchecked {
            for (uint256 i = 0; i < array.length; ) {
                if (array[i++] == addr) return true;
            }

            return false;
        }
    }

    function remove(address[] storage array, uint256 index) internal {
        if (index >= array.length) return;

        array[index] = array[array.length - 1];
        array.pop();
    }

    function indexOf(
        address[] memory array,
        address addr
    ) public pure returns (bool, uint256) {
        unchecked {
            for (uint256 i = 0; i < array.length; ) {
                if (array[i++] == addr) {
                    return (true, i);
                }
            }

            return (false, 0);
        }
    }
}

library StringArrayUtils {
    function contains(
        string[] memory array,
        string memory str
    ) public pure returns (bool) {
        unchecked {
            for (uint256 i = 0; i < array.length; ) {
                if (keccak256(bytes(array[i++])) == keccak256(bytes(str)))
                    return true;
            }

            return false;
        }
    }
}

library UintArrayUtils {
    function contains(uint[3] memory array, uint n) public pure returns (bool) {
        unchecked {
            for (uint256 i = 0; i < array.length; i++) {
                if (array[i++] == n) return true;
            }

            return false;
        }
    }

    function contains(uint[] memory array, uint n) public pure returns (bool) {
        unchecked {
            for (uint256 i = 0; i < array.length; i++) {
                if (array[i++] == n) return true;
            }

            return false;
        }
    }

    function sum(uint256[] memory array) public pure returns (uint256) {
        unchecked {
            uint256 result = 0;
            for (uint256 i = 0; i < array.length; i++) {
                result += array[i];
            }

            return result;
        }
    }

    function sum(uint256[6] memory array) public pure returns (uint256) {
        unchecked {
            uint256 result = 0;
            for (uint256 i = 0; i < array.length; i++) {
                result += array[i];
            }

            return result;
        }
    }
}
