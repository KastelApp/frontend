import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import WS, { beenConnectedSince, pingStore, testStatusStore } from "@/wrapper/WebSocket/WebSocket.ts";

const Wrapper = () => {
    const [ws2, setWs2] = useState<WS | null>(null);
    const [status] = useRecoilState(testStatusStore);
    const [beenConnected] = useRecoilState(beenConnectedSince)
    const [ping] = useRecoilState(pingStore);
    const [token, setToken] = useState("");

    useEffect(() => {
        if (ws2) return;

        setWs2(new WS({
            compress: true,
            encoding: "json",
            url: "ws://localhost:62240",
            version: "1"
        }));
    }, []);

    return (
        <>
            {/* Simple page which lets us debug / work with the wrapper, has two buttons one to disconnect and one to connect*/}
            {/* In the future possibly more stuff (i.e disabling compression if theres an issue with it etc) */}
            {/* TODO: Should be disabled in prod */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "50vh"
            }}>
                <input value={token} onChange={(e) => setToken(e.target.value)} />
                <Button onClick={() => ws2!.connect(token)}>Connect</Button>
                <br />
                <Button onClick={() => ws2!.disconnect()}>Disconnect</Button>
                <br />
                Current Status: {status}
                <br />
                Ready: {ws2?.status === "Ready" ? "true" : "false"}
                <br />
                User:
                <br />
                Been Connected Since: {new Date(beenConnected).toLocaleString()}
                <br />
                Ping: {ping}ms
            </div>
        </>
    );
};

export default Wrapper;
