// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.16;

interface IGuildRegistry {
    enum GuildEventType {
        DISBANDED,
        REGISTER_MEMBER,
        REGISTER_REQUEST_ACCEPTED,
        REGISTER_REQUEST_RECEIVED,
        UNREGISTER_MEMBER,
        UNREGISTER_REQUEST_RECEIVED
    }

    event GuildRegistry_GuildEvent(
        address indexed candidate,
        address indexed guild,
        GuildEventType indexed eventType
    );
}
