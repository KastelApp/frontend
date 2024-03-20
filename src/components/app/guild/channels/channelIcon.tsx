import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import constants from "$/utils/constants.ts";

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
        <svg
          width="18px"
          height="18px"
          viewBox="0 0 0.72 0.72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...svg}
        >
          <path
            d="m0.21 0.57 0.12 -0.42m0.06 0.42 0.12 -0.42m0.06 0.12H0.195m0.33 0.18H0.15"
            stroke="#ffff"
            strokeWidth="0.06"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...path}
          />
        </svg>
      )}

      {(channel?.type ?? type) === constants.channelTypes.GuildVoice && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18px"
          height="18px"
          viewBox="0 0 36 36"
          fill="none"
          {...svg}
        >
          <path
            stroke="#ffff"
            {...path}
            d="M0 10.512h8.484L21.246.111V35.89L8.484 25.488H0zm26.041-1.697q3.762 3.762 3.836 9.148 0 5.164-3.836 8.852l-2.582-2.656q2.656-2.656 2.656-6.271 0-3.688-2.656-6.418zm4.426-4.352Q36 9.996 36 17.816t-5.533 13.426l-2.73-2.729q4.426-4.352 4.426-10.66T27.737 7.119z"
          />
        </svg>
      )}

      {(channel?.type ?? type) === constants.channelTypes.GuildNews && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18px"
          height="18px"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...svg}
        >
          <path d="M3 11l18-5v12L3 14v-3z" {...path} />
          <path d="M11.6 16.8a3 3 0 11-5.8-1.6" {...path} />
        </svg>
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
