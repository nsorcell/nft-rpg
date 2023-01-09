// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {World} from "../World.sol";
import {IPlayer} from "../interfaces/tokens/IPlayer.sol";
import {StatsLibrary} from "../libraries/Stats.sol";
import {ClassLibrary} from "../libraries/Class.sol";
import {Currency} from "../tokens/Currency.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {UintArrayUtils} from "../libraries/ArrayUtils.sol";
import "../libraries/Errors.sol";

contract Player is IPlayer, ERC721 {
    using Counters for Counters.Counter;
    using UintArrayUtils for uint256[6];
    using UintArrayUtils for uint256[3];

    using SafeMath for uint256;

    uint256 private constant MAX_DISTRIBUTABLE_POINTS = 3;
    uint256 private constant FIRST_CLASS_REQUIRED_LEVEL = 5;
    uint256 private constant SECOND_CLASS_REQIRED_LEVEL = 10;
    uint256 private constant INITIAL_STAT_VALUE = 6;

    World private immutable i_world;
    Currency private immutable i_currency;
    Counters.Counter private _tokenIdCounter;

    uint256 private i_price;

    mapping(uint256 => uint256[6]) s_stats;
    mapping(uint256 => StatsLibrary.Attributes) s_attributes;
    mapping(uint256 => StatsLibrary.Travel) s_travel;
    mapping(address => uint256) s_tokenOwners;

    modifier onlyOwnerOf(uint256 player) {
        if (msg.sender != ownerOf(player)) {
            revert Player_OnlyAllowedForOwnerOf(player);
        }
        _;
    }

    modifier notAllowedWhileTraveling(uint256 player) {
        if (s_travel[player].isTraveling) {
            revert Player_NotAllowedWhileTraveling();
        }
        _;
    }

    constructor(
        World world,
        Currency currency,
        uint256 price
    ) ERC721("Player", "PLAYER") {
        i_world = world;
        i_currency = currency;
        i_price = price;
    }

    function create() external payable {
        if (balanceOf(msg.sender) > 0) {
            revert Player_MultiplePlayersNotAllowed();
        }

        if (msg.value != i_price) {
            revert Player_PaymentValueInvalid();
        }

        uint256 tokenId = _tokenIdCounter.current();
        s_stats[tokenId] = [
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE,
            INITIAL_STAT_VALUE
        ];

        StatsLibrary.Location memory location = StatsLibrary.Location(0, 0);

        s_attributes[tokenId] = StatsLibrary.Attributes(
            1,
            0,
            ClassLibrary.PrimaryClass.None,
            ClassLibrary.SecondaryClass.None,
            location,
            true
        );

        _safeMint(msg.sender, tokenId);
        s_tokenOwners[msg.sender] = tokenId;
        i_world.mintCurrency{value: msg.value}();

        i_world.adjustManaFlow();

        _tokenIdCounter.increment();
        emit Player_PlayerCreated(tokenId);
    }

    function die(uint256 player) external {
        if (msg.sender != address(i_world)) {
            revert Unauthorized();
        }

        s_attributes[player].isAlive = false;
    }

    function travel(
        uint256 player,
        uint256[2] memory to
    ) external onlyOwnerOf(player) {
        if (s_travel[player].isTraveling) {
            revert Player_AlreadyTraveling();
        }

        s_travel[player].isTraveling = true;
        StatsLibrary.Location memory location = s_attributes[player].location;
        StatsLibrary.Location memory destination = StatsLibrary.Location(
            to[0],
            to[1]
        );

        uint256 speed = StatsLibrary.calculateSpeed(s_stats[player]);
        uint256 dX = location.x > destination.x ? location.x : destination.x;
        uint256 dY = location.y > destination.y ? location.x : destination.x;

        uint256 distance = StatsLibrary.sqrt((dX ** 2) + (dY ** 2));
        uint256 arrival = block.timestamp + distance / speed;

        s_travel[player].arrival = arrival;
        s_travel[player].destination = destination;

        emit Player_StartedTraveling(
            player,
            arrival,
            destination.x,
            destination.y
        );
    }

    function arrive(uint256 player) public onlyOwnerOf(player) {
        StatsLibrary.Travel memory travelData = s_travel[player];

        if (!travelData.isTraveling) {
            revert Player_NotTraveling();
        }

        if (block.timestamp < travelData.arrival) {
            revert Player_TravelNotFinished(
                travelData.arrival - block.timestamp
            );
        }

        s_attributes[player].location = travelData.destination;

        emit Player_FinishedTraveling(
            player,
            travelData.arrival,
            travelData.destination.x,
            travelData.destination.y
        );

        travelData.arrival = 0;
        travelData.destination = StatsLibrary.Location(0, 0);
        travelData.isTraveling = false;

        s_travel[player] = travelData;
    }

    function firstClassTransfer(
        uint256 player,
        ClassLibrary.PrimaryClass selected
    ) external onlyOwnerOf(player) {
        if (
            s_attributes[player].primaryClass != ClassLibrary.PrimaryClass.None
        ) {
            revert Player_NotEligibleForClassTransfer();
        }

        if (s_attributes[player].level < FIRST_CLASS_REQUIRED_LEVEL) {
            revert Player_NotEligibleForClassTransfer();
        }

        s_attributes[player].primaryClass = selected;
        emit Player_FirstClassTransfer(player, uint256(selected));
    }

    function secondClassTransfer(
        uint256 player,
        ClassLibrary.SecondaryClass selected
    ) external onlyOwnerOf(player) {
        if (
            s_attributes[player].primaryClass == ClassLibrary.PrimaryClass.None
        ) {
            revert Player_NotEligibleForClassTransfer();
        }

        if (s_attributes[player].level < SECOND_CLASS_REQIRED_LEVEL) {
            revert Player_NotEligibleForClassTransfer();
        }

        uint256[3] memory options = ClassLibrary.getOptions(
            s_attributes[player].primaryClass
        );

        if (!options.contains(uint256(selected))) {
            revert Player_InvalidClassOption(options);
        }

        s_attributes[player].secondaryClass = selected;
        emit Player_SecondClassTransfer(player, uint256(selected));
    }

    function levelUp(
        uint256 player,
        uint256[6] memory points
    ) public onlyOwnerOf(player) {
        if (points.sum() != MAX_DISTRIBUTABLE_POINTS) {
            revert Player_InvalidAttributePoints();
        }

        StatsLibrary.Attributes memory attributes = s_attributes[player];
        uint256 requiredXp = StatsLibrary.calculateXPForNextLevel(
            attributes.level
        );

        if (attributes.experience < requiredXp) {
            revert Player_CannotLevelUp(requiredXp - attributes.experience);
        }

        uint256 remainingXp = attributes.experience - requiredXp;

        uint256[6] memory stats = s_stats[player];

        unchecked {
            for (uint256 i = 0; i < 6; i++) {
                stats[i] += points[i];
            }
        }

        s_stats[player] = stats;
        s_attributes[player].level++;
        s_attributes[player].experience = remainingXp;

        emit Player_LevelUp(player);
    }

    function transferCurrency(uint256 toPlayer, uint256 amount) public {
        address to = ownerOf(toPlayer);

        i_currency.transferFrom(msg.sender, to, amount);
    }

    function updateXp(uint256 player, uint256 amount) public {
        if (msg.sender != address(i_world)) {
            revert Unauthorized();
        }

        s_attributes[player].experience += amount;

        emit Player_XPReceived(player, amount);
    }

    function gameBalanceOf(uint256 player) public view returns (uint256) {
        address owner = ownerOf(player);

        return i_currency.balanceOf(owner);
    }

    function getStats(
        uint256 player
    ) public view returns (StatsLibrary.StatsStruct memory) {
        return StatsLibrary.statsArrToStruct(s_stats[player]);
    }

    function getAttributes(
        uint256 player
    ) public view returns (StatsLibrary.Attributes memory) {
        return s_attributes[player];
    }

    function getTravelInfo(
        uint256 player
    ) public view returns (StatsLibrary.Travel memory) {
        return s_travel[player];
    }

    function getPlayerOf(address account) public view returns (uint256) {
        return s_tokenOwners[account];
    }
}
