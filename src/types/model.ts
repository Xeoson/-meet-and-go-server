type Timestamp = {
	seconds: number,
	nanoseconds: number
}


export interface IMessage {
  id?: string;
  chatId: string;
  createdById?: string;
  type: "text" | "image";
  body: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}