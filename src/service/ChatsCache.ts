import { WebSocket } from "ws";

export interface IChat {
  connections: WebSocket[];
}

class ChatsCache {
  cache = new Map<string, IChat>();

	private getChat(chatId: string) {
		const chat = this.cache.get(chatId)
		if (!chat) throw new Error('chat not found')
		return chat
	}

  addConnectionsOnChats(chatIds: string[], connections: WebSocket[]) {
    for (const chatId of chatIds) {
      const chat = this.cache.get(chatId);
      if (chat) {
				chat.connections.push(...connections)
      } else {
        this.cache.set(chatId, { connections });
      }
    }
  }

  deleteConnectionOnChats(chatIds: string[], connection: WebSocket) {
		console.log("deleteConnectionOnChats");
    for (const chatId of chatIds) {
      const chat = this.getChat(chatId);
			console.log('conn len before ', chat.connections.length);
			const targetConnIndex = chat.connections.findIndex((el) => el == connection)
			chat.connections.splice(targetConnIndex, 1)

			//log
			const chatLog = this.getChat(chatId)
			console.log('conn len after ', chatLog.connections.length);
    }
  }

	deleteChat(chatId: string) {
		this.cache.delete(chatId)
	}

	notifyChatConnections(chatId: string, body: Record<string, any>) {
		const chat = this.getChat(chatId)
		console.log('notify connections len', chat.connections.length);
		for (const connection of chat.connections) {
			connection.send(JSON.stringify(body))
		}
	}
}

export default new ChatsCache();
