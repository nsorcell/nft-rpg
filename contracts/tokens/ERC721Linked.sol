// SPDX-License-Identifier: AGPLv3
pragma solidity 0.8.16;
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Linked is ERC721 {
    using Counters for Counters.Counter;

    mapping(uint256 => bytes) owners;
    Counters.Counter private _tokenIdCounter;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function _safeMint(address parentNFT, uint256 parentId) internal override {
        uint256 tokenId = _tokenIdCounter.current();

        bytes memory owner = abi.encodePacked(
            address(parentNFT),
            uint256(parentId)
        );

        owners[tokenId] = owner;
        _tokenIdCounter.increment();

        ERC721._safeMint(parentNFT, tokenId);
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        bytes memory location = owners[tokenId];

        (address parentNFTAddress, uint256 parentTokenId) = abi.decode(
            location,
            (address, uint256)
        );

        return ERC721(parentNFTAddress).ownerOf(uint256(parentTokenId));
    }
}
