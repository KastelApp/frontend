import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import constants from "$/utils/constants.ts";

const ChannelIcon = ({ channel, svg, path }: { channel: BaseChannel; svg?: React.SVGProps<SVGSVGElement>, path?: React.SVGProps<SVGPathElement> }) => {
    return (
        <>
            {channel.type === constants.channelTypes.GuildText && (
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

            {channel.isVoiceBased() && (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" {...svg}>
                    <path
                        fill="currentColor"
                        d="M12 2c-4.4 0-8 3.6-8 8v4c0 4.4 3.6 8 8 8s8-3.6 8-8v-4c0-4.4-3.6-8-8-8zm6 12c0 3.3-2.7 6-6 6s-6-2.7-6-6v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4zm-4-4h-2v-4h2v4zm-4 0h-2v-4h2v4zm-3 4h-2v-4h2v4zm-1-6h-2v-4h2v4z"
                        {...path}
                    />
                </svg>
            )}

            {channel.type === constants.channelTypes.GuildNews && (
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
        </>
    );
};

export default ChannelIcon;