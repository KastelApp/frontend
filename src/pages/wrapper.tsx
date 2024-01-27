import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import WS, { testStatusStore } from "@/wrapper/WebSocket/WebSocket.ts";

const Wrapper = () => {
    const [ws2, setWs2] = useState<WS | null>(null);
    const [status] = useRecoilState(testStatusStore);

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
                <Button onClick={() => ws2!.connect("temp")}>Connect</Button>
                <br />
                <Button onClick={() => ws2!.disconnect()}>Disconnect</Button>
                <br />
                Current Status: {status}
                <br />
                Ready: {ws2?.status === "Ready" ? "true" : "false"}
                <br />
                User:
            </div>
        </>
    );
};

export default Wrapper;
