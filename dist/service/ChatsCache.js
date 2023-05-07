"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatsCache {
    constructor() {
        this.cache = new Map();
    }
    getChat(chatId) {
        const chat = this.cache.get(chatId);
        if (!chat)
            throw new Error('chat not found');
        return chat;
    }
    addConnectionsOnChats(chatIds, connections) {
        for (const chatId of chatIds) {
            const chat = this.cache.get(chatId);
            if (chat) {
                chat.connections.push(...connections);
            }
            else {
                this.cache.set(chatId, { connections });
            }
        }
    }
    deleteConnectionOnChats(chatIds, connection) {
        console.log("deleteConnectionOnChats");
        for (const chatId of chatIds) {
            const chat = this.getChat(chatId);
            console.log('conn len before ', chat.connections.length);
            const targetConnIndex = chat.connections.findIndex((el) => el == connection);
            chat.connections.splice(targetConnIndex, 1);
            //log
            const chatLog = this.getChat(chatId);
            console.log('conn len after ', chatLog.connections.length);
        }
    }
    deleteChat(chatId) {
        this.cache.delete(chatId);
    }
    notifyChatConnections(chatId, body) {
        const chat = this.getChat(chatId);
        console.log('notify connections len', chat.connections.length);
        for (const connection of chat.connections) {
            connection.send(JSON.stringify(body));
        }
    }
}
exports.default = new ChatsCache();
