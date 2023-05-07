"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const firestore_1 = require("firebase/firestore");
const ws_1 = require("ws");
const conts_1 = require("./common/conts");
const helpers_1 = require("./common/helpers");
const firebase_1 = require("./lib/firebase");
const ChatsCache_1 = __importDefault(require("./service/ChatsCache"));
const ConnectionsCache_1 = __importDefault(require("./service/ConnectionsCache"));
const wss = new ws_1.WebSocketServer({
    port: 7171,
    verifyClient: (info, callback) => {
        if (info.origin.startsWith(conts_1.CLIENT_URL)) {
            callback(true);
        }
        else {
            callback(false);
        }
    },
});
const messageHandlers = (0, helpers_1.createMessageHandlers)();
wss.on("connection", (connection, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.url) {
            // check user existing
            const params = (0, helpers_1.parseSearchParams)(req.url);
            const userId = params.get("userId");
            if (!userId) {
                throw new Error("must contain userId");
            }
            const userRes = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId));
            if (!userRes.exists()) {
                throw new Error("user not found");
            }
            // get active user chats
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, "chats"), (0, firestore_1.where)("userIds", "array-contains", userId));
            const chatsRes = yield (0, firestore_1.getDocs)(q);
            const userChatIds = chatsRes.docs.map((el) => el.data().id);
            // cache active chats
            ConnectionsCache_1.default.cache.set(connection, { activeChatIds: userChatIds });
            ChatsCache_1.default.addConnectionsOnChats(userChatIds, [connection]);
        }
        connection.on("close", () => {
            const conn = ConnectionsCache_1.default.cache.get(connection);
            if (conn) {
                ChatsCache_1.default.deleteConnectionOnChats(conn.activeChatIds, connection);
                ConnectionsCache_1.default.cache.delete(connection);
            }
        });
        connection.on("message", (ev) => {
            try {
                const { type, body } = JSON.parse(ev);
                const handler = messageHandlers.get(type);
                handler(body, connection);
            }
            catch (error) {
                console.log("error", error);
                connection.send(JSON.stringify({ message: "Invalid request" }));
            }
        });
    }
    catch (error) {
        console.log("error", error);
        // connection.close(400, error.message);
    }
}));
