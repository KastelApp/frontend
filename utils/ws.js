const WS_URL = process.env.WS_ENDPOINT;
const encoding = "json";

const payloads = {
    Hello: 0,
    Auth: 1,
    Authed: 2,
    HeartBeat: 3,
    HeartBeatAck: 4,
};

async function connect(token) {
    let ws = new WebSocket(`${WS_URL}/client?v=1&encoding=${encoding}`);

    ws.onopen = () => {
        console.log("Connected to WS")
    }

    ws.onmessage = (e) => {
        console.log(e.data)
        let data;
        try {
            data = JSON.parse(e.data);
        } catch (e) {
            console.log("Invalid JSON received from the gateway!");
            return;
        }

        let sessionId;
        let heartbeatInterval;
        let sequence = 0;
        let lastHeartbeat = -1;

        if (data?.s) sequence = data.s;

        switch (data.op) {
            case payloads.Hello:

                console.log("Received Hello payload from the gateway, trying to authenticate...");

                ws.send(
                    JSON.stringify({
                        op: payloads.Auth,
                        d: {
                            Token: token,
                            Settings: {
                                Compress: false, // This if true receives zlib compressed data
                            }
                        },
                    })
                );
                break;
            case payloads.Authed:
                console.log("Received Authed payload from the gateway, authenticated!");

                heartbeatInterval = setInterval(() => {
                    ws.send(
                        JSON.stringify({
                            op: payloads.HeartBeat,
                            d: {
                                Sequence: sequence,
                            },
                        })
                    );
                }, data.d.HeartbeatInterval);

                break;
            case payloads.HeartBeatAck:
                console.log("Received HeartBeatAck payload from the gateway, heartbeat acknowledged!");

                lastHeartbeat = Date.now();

                break;
            default:
                console.log(`Received unknown payload from the gateway! (${data.op})`);
                break;
        }
    }
}



async function sendPayload(ws, payload) {
    ws.send(JSON.stringify(payload));
}

export {
    connect,
    payloads,
}