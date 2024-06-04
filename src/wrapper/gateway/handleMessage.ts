import safeParse from "@/utils/safeParse.ts";
import Websocket from "./Websocket.ts";

const handleMessage = async (ws: Websocket, data: unknown) => {
    const decompressed = safeParse(ws.decompress(data));

    console.log(decompressed);
}

export default handleMessage;