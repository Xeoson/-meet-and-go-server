import { WebSocket } from "ws";


export interface IConnectionMetadata {
  activeChatIds: string[];
}

class ConnectionsCache {
  cache = new Map<WebSocket, IConnectionMetadata>();

	private getConnection(connection: WebSocket) {
		const conn = this.cache.get(connection)
		if (!conn) throw new Error("connection not found");
		return conn
	}

	addChat(connection: WebSocket, chatId: string) {
		const conn = this.getConnection(connection)
		conn.activeChatIds.push(chatId)
	}
	deleteChat(connection: WebSocket, chatId: string) {
		console.log("deleteChat");
		const conn = this.getConnection(connection)
		console.log('active chats before ', conn.activeChatIds.length);
		const targetIdIndex = conn.activeChatIds.findIndex((el) => el == chatId)
		conn.activeChatIds.splice(targetIdIndex, 1)

		//log
		const connLog = this.getConnection(connection)
		console.log('active chats after ', connLog.activeChatIds.length);
	}
}

export default new ConnectionsCache()