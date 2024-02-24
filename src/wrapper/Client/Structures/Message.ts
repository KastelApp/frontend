import Websocket from "$/WebSocket/WebSocket.ts";

class Message {
    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }

    public constructor(ws: Websocket) {
        this.#ws = ws;
    }
}

export default Message;