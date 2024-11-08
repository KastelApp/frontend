import MessageMarkDown from "@/components/Message/Markdown/MarkDown.tsx";
import TopNavBar from "@/components/NavBars/TopNavBar.tsx";
import { Button } from "@/components/ui/button";
import { Channel } from "@/wrapper/Stores/ChannelStore.ts";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { Divider } from "@nextui-org/react";
import { Hash, Search, PinIcon, Users, Sidebar } from "lucide-react";

interface TopNavbarProps {
  toggleChannelSidebar: () => void;
  toggleMembersSidebar: () => void;
  isMobile: boolean;
  isChannelsOpen: boolean;
  channel: Channel;
}

const ChannelTopNavbar = ({ toggleChannelSidebar, toggleMembersSidebar, isMobile, isChannelsOpen, channel }: TopNavbarProps) => {
  return (
    <TopNavBar>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleChannelSidebar} className={isMobile && isChannelsOpen ? "ml-auto" : ""}>
          <Sidebar className="h-5 w-5 text-gray-400" />
        </Button>
        {((isMobile && !isChannelsOpen) || !isMobile) && (
          <>
            <Hash className="h-5 w-5 text-gray-400 ml-2" />
            <span className="text-white font-semibold ml-2 truncate">{channel.name || "Unknown Channel"}</span>
            {channel.description && (
              <>
                <Divider orientation="vertical" className="ml-2 mr-2 h-6 w-[3px]" />
                <span className="w-96 flex items-center cursor-pointer truncate text-sm text-gray-400 whitespace-pre-wrap break-words" onClick={() => {

                  modalStore.getState().createModal({
                    title: (
                      <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-gray-400" />
                        <p className="font-semibold text-gray-300">{channel.name}</p>
                      </div>
                    ),
                    id: `channel-topic-${channel.id}`,
                    body: (
                      <div className="flex items-center whitespace-pre-wrap break-words">
                        <MessageMarkDown>
                          {channel.description!}
                        </MessageMarkDown>
                      </div>
                    )
                  });

                }}>
                  <MessageMarkDown>
                    {channel.description}
                  </MessageMarkDown>
                </span>
              </>
            )}
          </>
        )}
      </div>
      <div className="flex items-center space-x-1">
        {!isMobile && (
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon">
              <PinIcon className="h-5 w-5 text-gray-400" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" onClick={toggleMembersSidebar}>
          <Users className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
    </TopNavBar>
  );
};

export default ChannelTopNavbar;