import "dotenv/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { WebSocketServer } from "ws";
import { CLIENT_URL } from "./common/conts";
import { createMessageHandlers, parseSearchParams } from "./common/helpers";
import { db } from "./lib/firebase";
import ChatsCache from "./service/ChatsCache";
import ConnectionsCache from "./service/ConnectionsCache";
import { IRequest, IResponse } from "./types/request";

const wss = new WebSocketServer({
  port: 7171,
  verifyClient: (info, callback) => {
    if (info.origin.startsWith(CLIENT_URL)) {
      callback(true);
    } else {
      callback(false);
    }
  },
});

const messageHandlers = createMessageHandlers()

wss.on("connection", async (connection, req) => {
  try {
    if (req.url) {
      // check user existing
      const params = parseSearchParams(req.url);
      const userId = params.get("userId");
      if (!userId) {
        throw new Error("must contain userId");
      }
      const userRes = await getDoc(doc(db, "users", userId));
      if (!userRes.exists()) {
        throw new Error("user not found");
      }

      // get active user chats
      const q = query(
        collection(db, "chats"),
        where("userIds", "array-contains", userId)
      );
      const chatsRes = await getDocs(q);
      const userChatIds = chatsRes.docs.map((el) => el.data().id as string);

      // cache active chats
      ConnectionsCache.cache.set(connection, { activeChatIds: userChatIds });
      ChatsCache.addConnectionsOnChats(userChatIds, [connection]);
    }

    connection.on("close", () => {
      const conn = ConnectionsCache.cache.get(connection);
      if (conn) {
        ChatsCache.deleteConnectionOnChats(conn.activeChatIds, connection);
				ConnectionsCache.cache.delete(connection)
      }
    });

    connection.on("message", (ev: any) => {
      try {
        const { type, body } = JSON.parse(ev) as IRequest;

				const handler = messageHandlers.get(type)
				handler(body, connection)
      } catch (error) {
        console.log("error", error);
        connection.send(JSON.stringify({ message: "Invalid request" }));
      }
    });
  } catch (error: any) {
    console.log("error", error);
    // connection.close(400, error.message);
  }
});
