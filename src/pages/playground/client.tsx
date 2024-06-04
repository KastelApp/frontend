import { useClientStore } from "@/wrapper/Stores.ts";
import { useEffect } from "react";

const ClientPlayground = () => {

    const { client } = useClientStore();

    useEffect(() => {
        client.login("NDU4Nzk0MTIxOTI4NDE3Mjk.MTcxMjM0ODkwNDI3MDZsb2NEQWxBa09hV0FmeWFjR1FFSUE.3rq7J34Vb939J8g0X__nx3uRMHmlaAOX4rrZsObfl7I")
        
        console.log(client);
    }, [client])

    return (
        <>
            Nothing yet
        </>
    );
};

export default ClientPlayground;