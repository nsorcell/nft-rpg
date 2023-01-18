// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface ICastable {
    function getName() external pure returns (string memory);

    function getAssociatedClass() external pure returns (uint256);

    function getSpells() external view returns (string[] memory);

    function cast(
        uint256 spell,
        uint256 caster,
        uint256 target
    ) external returns (uint256 cost);
}
