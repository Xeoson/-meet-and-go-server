"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectionsCache {
    constructor() {
        this.cache = new Map();
    }
    getConnection(connection) {
        const conn = this.cache.get(connection);
        if (!conn)
            throw new Error("connection not found");
        return conn;
    }
    addChat(connection, chatId) {
        const conn = this.getConnection(connection);
        conn.activeChatIds.push(chatId);
    }
    deleteChat(connection, chatId) {
        console.log("deleteChat");
        const conn = this.getConnection(connection);
        console.log('active chats before ', conn.activeChatIds.length);
        const targetIdIndex = conn.activeChatIds.findIndex((el) => el == chatId);
        conn.activeChatIds.splice(targetIdIndex, 1);
        //log
        const connLog = this.getConnection(connection);
        console.log('active chats after ', connLog.activeChatIds.length);
    }
}
exports.default = new ConnectionsCache();
