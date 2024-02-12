import { Button, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { beenConnectedSince, pingStore, testStatusStore } from "@/wrapper/WebSocket/WebSocket.ts";
import Client from "$/Client/Client.ts";
import { userStore } from "@/wrapper/utils/Stores.ts";

const Wrapper = () => {
    const [ws2, setWs2] = useState<Client | null>(null);
    const [status] = useRecoilState(testStatusStore);
    const [beenConnected] = useRecoilState(beenConnectedSince);
    const [ping] = useRecoilState(pingStore);
    const [users] = useRecoilState(userStore);
    const [token, setToken] = useState("");

    useEffect(() => {
        if (ws2) return;

        // @ts-expect-error -- this is fine.
        const client = new Client({
            wsOptions: {
                compress: true,
                encoding: "json",
                url: "ws://localhost:62240",
                version: "1"
            }
        });

        setWs2(client);

        const token = localStorage.getItem("devtoken");

        if (token) {
            setToken(token);

            client.connect(token);
        }
    }, []);

    useEffect(() => {
        console.log(users);

        if (Math.random() < 0.25) {
            throw new Error("Random error");
        }
    }, [users]);

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
                <Input style={{ marginBottom: "10px", width: "55%" }} value={token} onChange={(e) => setToken(e.target.value)} />
                <div style={{ display: "flex", justifyContent: "space-around", width: "50%" }}>
                    <Button onClick={() => ws2!.connect(token)}>Connect</Button>
                    <Button onClick={() => ws2!.ws.disconnect()}>Disconnect</Button>
                    <Button onClick={() => console.log(users)}>Users</Button>
                </div>
                <br />
                <div style={{ textAlign: "center", width: "80%" }}>
                    <p>Current Status: {status}</p>
                    <p>Ready: {ws2?.ws?.status === "Ready" ? "true" : "false"}</p>
                    <p>User: {users.find((user) => user.isClient)?.fullUsername ?? "Unknown#0000"}</p>
                    <p>Been Connected Since: {new Date(beenConnected).toLocaleString()}</p>
                    <p>Ping: {ping}ms</p>
                </div>
            </div>
        </>
    );
};

export default Wrapper;
