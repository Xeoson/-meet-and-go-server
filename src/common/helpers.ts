import { WebSocket } from "ws";
import ChatsCache from "../service/ChatsCache";
import ConnectionsCache from "../service/ConnectionsCache";
import { IResponse, RequestBodyType } from "../types/request";

export const parseSearchParams = (url: string) =>
  new URLSearchParams(url.substring(url.indexOf("?")));

type MessageHandlersType = {
  [Key in keyof RequestBodyType]: (data: RequestBodyType[Key], connection: WebSocket) => void;
};
export const createMessageHandlers = () => {
  const handlers: MessageHandlersType = {
    "message:send": (body) => {
			const resp: IResponse = {
				type: "message:send",
				body,
			};
			ChatsCache.notifyChatConnections(body.chatId, resp)
    },
    "event:create": (body, connection) => {
			const {chatId} = body
			ChatsCache.addConnectionsOnChats([chatId], [connection])
			ConnectionsCache.addChat(connection, chatId)
		},
    "event:delete": (body, connection) => {
			const {chatId} = body
			ChatsCache.deleteChat(chatId)
			ConnectionsCache.deleteChat(connection, chatId)
		},
    "event:enter": (body, connection) => {          
			const { chatId } = body;
			ChatsCache.addConnectionsOnChats([chatId], [connection])
			ConnectionsCache.addChat(connection, chatId)
			const res: IResponse = {
				type: 'event:enter',
				body: {chatId}
			}
			ChatsCache.notifyChatConnections(chatId, res)
		},
    "event:leave": (body, connection) => {
			const { chatId } = body;
			ChatsCache.deleteConnectionOnChats([chatId], connection)
			ConnectionsCache.deleteChat(connection, chatId)
		},
  };

	return new Map<keyof RequestBodyType, any>(
    Object.entries(handlers) as any
  );
};
