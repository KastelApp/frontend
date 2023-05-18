const payloads = {
    Hello: 0,
    Auth: 1,
    Authed: 2,
    HeartBeat: 3,
    HeartBeatAck: 4,
};

class Events {
    constructor(ws, send) {
        this.ws = ws;

        this.send = send ?? false;
    }

    auth() {
        const payload = JSON.stringify({
            op: payloads.Auth,
            d: {
                Token: this.ws.token,
                Settings: {
                    Compress: this.ws.compress ?? false,
                }
            }
        });

        if (this.send) {
            this.ws.send(payload);
        }

        return payload;
    }

    heartbeat() {
        const payload = JSON.stringify({
            op: payloads.HeartBeat,
            d: {
                Sequence: this.ws.sequence ?? 0,
            }
        });

        if (this.send) {
            this.ws.send(payload);
        }

        return payload;
    }
}

export {Events};