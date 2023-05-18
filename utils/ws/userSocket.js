import {Events} from './events.js';
const payloads = {
    Hello: 0,
    Auth: 1,
    Authed: 2,
    HeartBeat: 3,
    HeartBeatAck: 4,
};


const ErrorPayloads = { // straight from @kastelll/core
    UnknownError: 1_000, // Unknown error
    MissedHeartbeat: 1_001, // Missed heartbeat
    HardUnknownError: 4_000, // Unknown error
    UnknownOpcode: 4_001, // Unknown opcode
    DecodeError: 4_002, // Failed to decode payload
    NotAuthenticated: 4_003, // Not authenticated (no IDENTIFY payload sent)
    AuthenticationFailed: 4_004, // Authentication failed (wrong password or just an error)
    AlreadyAuthenticated: 4_005, // Already authenticated (why are you sending another IDENTIFY payload?)
    InvalidSeq: 4_007, // Invalid sequence sent when resuming (seq is 5 but the resume payload provided a seq of 4)
    RateLimited: 4_008, // User spammed the gateway (not used yet)
    SessionTimedOut: 4_009, // session timed out
    InvalidRequest: 4_010, // Invalid request (E/O)
    ServerShutdown: 4_011, // Server is shutting down
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

                // if data.op code exists in ErrorPayloads, close the socket
                if (Object.values(ErrorPayloads).includes(data?.op)) {

                    reject({
                        code: data.op,
                        message: data.d?.message || 'Unknown Error'
                    });

                    if (!this.websocket.CLOSED) {
                        this.websocket.close();
                    }

                    console.error(`Error: ${data.op} - ${data.d?.message || 'Unknown Error'}`);

                    return;
                }

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

            this.websocket.onclose = (event) => {
                console.log(`Socket Closed: ${event?.code} - ${event?.reason}`);
                clearInterval(this.heartbeatInterval);
                clearTimeout(this.rejectTimeout);
            }

        });
    }
}

export { UserSocket };