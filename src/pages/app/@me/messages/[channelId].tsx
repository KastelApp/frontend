import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import DmNavBar from "@/components/NavBars/DmNavBar.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import { useRouter } from "next/router";

const DmChannel = () => {

    const router = useRouter()

    return (
        <AppLayout>
            <DmNavBar title={
                <p className="font-normal">
                    {router.query.channelId}
                </p>
            }>
                <TextBasedChannel />
            </DmNavBar>
        </AppLayout>
    );
};

export default DmChannel;