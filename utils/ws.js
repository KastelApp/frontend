const WS_URL = process.env.WS_ENDPOINT;
const Version = process.env.WS_VERSION;
const encoding = "json";

async function connection() {
    return new WebSocket(`${WS_URL}/client?v=${Version}&encoding=${encoding}`);
}

export {
    connection,
}