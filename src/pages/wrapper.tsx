import { testStore } from "@/utils/stores.ts";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import WS, { testStatusStore } from "@/wrapper/WebSocket/WebSocket.ts";

const Wrapper = () => {
    const [ws2, setWs2] = useState<WS | null>(null);
    const [test] = useRecoilState(testStore);
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
            {/* lol <Button onClick={() => ws2!.connect("temp")}>Connect</Button>
        <br />
        Current Status: {status} */}
            {/* Simple page which lets us debug / work with the wrapper, should have two buttons one to disconnect and one to connect, and then a form to send custom ws data and an area to show the status */}
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
                User: {ws2?.user}
            </div>
        </>
    );
};

export default Wrapper;
