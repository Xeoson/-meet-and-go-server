import { IMessage } from "./model";

export type RequestBodyType = {
  "event:create": { chatId: string };
  "event:enter": { chatId: string };
  "event:leave": { chatId: string };
  "event:delete": { chatId: string };
  "message:send": IMessage;
};

export type IRequest = {
  [Key in keyof RequestBodyType]: { type: Key; body: RequestBodyType[Key] };
}[keyof RequestBodyType];

export type ResponseBodyType = {
  "message:send": IMessage;
	"event:enter": {chatId: string};
};

export type IResponse = {
  [Key in keyof ResponseBodyType]: {
    type: Key;
    body: ResponseBodyType[Key];
  };
}[keyof ResponseBodyType];
