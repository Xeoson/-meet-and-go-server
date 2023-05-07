"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageHandlers = exports.parseSearchParams = void 0;
const ChatsCache_1 = __importDefault(require("../service/ChatsCache"));
const ConnectionsCache_1 = __importDefault(require("../service/ConnectionsCache"));
const parseSearchParams = (url) => new URLSearchParams(url.substring(url.indexOf("?")));
exports.parseSearchParams = parseSearchParams;
const createMessageHandlers = () => {
    const handlers = {
        "message:send": (body) => {
            const resp = {
                type: "message:send",
                body,
            };
            ChatsCache_1.default.notifyChatConnections(body.chatId, resp);
        },
        "event:create": (body, connection) => {
            const { chatId } = body;
            ChatsCache_1.default.addConnectionsOnChats([chatId], [connection]);
            ConnectionsCache_1.default.addChat(connection, chatId);
        },
        "event:delete": (body, connection) => {
            const { chatId } = body;
            ChatsCache_1.default.deleteChat(chatId);
            ConnectionsCache_1.default.deleteChat(connection, chatId);
        },
        "event:enter": (body, connection) => {
            const { chatId } = body;
            ChatsCache_1.default.addConnectionsOnChats([chatId], [connection]);
            ConnectionsCache_1.default.addChat(connection, chatId);
            const res = {
                type: 'event:enter',
                body: { chatId }
            };
            ChatsCache_1.default.notifyChatConnections(chatId, res);
        },
        "event:leave": (body, connection) => {
            const { chatId } = body;
            ChatsCache_1.default.deleteConnectionOnChats([chatId], connection);
            ConnectionsCache_1.default.deleteChat(connection, chatId);
        },
    };
    return new Map(Object.entries(handlers));
};
exports.createMessageHandlers = createMessageHandlers;
