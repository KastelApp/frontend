import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import constants from "$/utils/constants.ts";
import React from "react";
import { Hash, Megaphone, Volume2 } from "lucide-react";

const ChannelIcon = ({
  channel,
  svg,
  path,
  type,
}: {
  channel?: BaseChannel;
  type?: number;
  svg?: React.SVGProps<SVGSVGElement>;
  path?: React.SVGProps<SVGPathElement>;
}) => {
  return (
    <>
      {(channel?.type ?? type) === constants.channelTypes.GuildText && (
        <Hash />
      )}

      {(channel?.type ?? type) === constants.channelTypes.GuildVoice && (
        <Volume2 />
        )}

      {(channel?.type ?? type) === constants.channelTypes.GuildNews && (
        <Megaphone />
        )}

      {(channel?.type ?? type) === constants.channelTypes.GuildMarkdown && (
        <svg
          width="18px"
          height="18px"
          viewBox="0 0 0.64 0.64"
          xmlns="http://www.w3.org/2000/svg"
          {...svg}
        >
          <path
            d="M0.254 0.2h0.084v0.261H0.28l0.002 -0.212 -0.071 0.212H0.163l-0.072 -0.212c0.002 0.026 0.002 0.212 0.002 0.212H0.04V0.2h0.086s0.061 0.18 0.063 0.192zm0.268 0.145v-0.14H0.444v0.14H0.367l0.117 0.117L0.6 0.345z"
            fill="#fff"
            {...path}
            stroke={"none"}
          />
        </svg>
      )}
    </>
  );
};

export default ChannelIcon;
