import {Events} from './events.js';
const payloads = {
    Hello: 0,
    Auth: 1,
    Authed: 2,
    HeartBeat: 3,
    HeartBeatAck: 4,
};

class UserSocket {
    constructor(
        token,
        version,
        encoding,
        compress
    ) {

        this.token = token;

        this.version = version;

        this.encoding = encoding;

        this.compress = compress;

        this.websocket = null;

        this.events = null;

        this.userData = null;

        this.heartbeatInterval = null;

        this.sequence = 0;

        this.rejectTimeout = null;
    }

    send(payload) {
        this.websocket.send(payload)
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.websocket = new WebSocket(`wss://canary-gateway.kastelapp.com/client?v=${this.version}&encoding=${this.encoding}`);

            this.websocket.onopen = () => {
                console.log('Connected to Websocket')
            };

            this.websocket.onmessage = (event) => {

                let data;

                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    console.log(`Invalid JSON: ${event.data}`);
                    return;
                }

                if (data?.s) this.sequence = data.s;

                switch (data.op) {
                    case payloads.Hello:
                        this.events = new Events(this, true);
                        this.events.auth();

                        this.rejectTimeout = setTimeout(() => {
                            reject('Failed to authenticate');
                        }, 25000);
                        break;
                    case payloads.Authed:
                        this.userData = data.d;

                        this.heartbeatInterval = setInterval(() => {
                            this.events.heartbeat();
                        }, data.d.HeartbeatInterval);

                        resolve(this.userData); // Resolve the promise with the user data

                        clearTimeout(this.rejectTimeout);

                        break;
                    case payloads.HeartBeatAck:
                        console.log('Heartbeat Acknowledged');
                        break;
                    default:
                        console.log(`Unknown OP Code: ${data.op}`);
                        break;
                }
            };

        });
    }
}

export { UserSocket };