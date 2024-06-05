import { useClientStore } from "@/wrapper/Stores.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useEffect } from "react";

const ClientPlayground = () => {

    const { client } = useClientStore();
    const { users, getUser } = useUserStore();
    const { guilds } = useGuildStore();
    const { channels } = useChannelStore();

    useEffect(() => {
        client.login("NDU4Nzk0MTIxOTI4NDE3Mjk.MTcxMjM0ODkwNDI3MDZsb2NEQWxBa09hV0FmeWFjR1FFSUE.3rq7J34Vb939J8g0X__nx3uRMHmlaAOX4rrZsObfl7I");

        console.log(client);

        console.log(getUser("123"));
    }, [client]);

    useEffect(() => {
        console.log(users);
        console.log(guilds);
        console.log(channels);
    }, [users, guilds, channels]);

    return (
        <>
            Nothing yet
        </>
    );
};

export default ClientPlayground;