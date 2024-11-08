
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Routes = {
    login: () => "/login",
    register: () => "/register",

    app: () => "/app",

    /* Everything to do with hubs */
    hubs: () => "/app/hubs",
    hub: (hubId: string) => `/app/hubs/${hubId}`,
    hubChannels: (hubId: string) => `/app/hubs/${hubId}/channels`,
    hubChannel: (hubId: string, channelId: string) => `/app/hubs/${hubId}/channels/${channelId}`,
} satisfies {
    [r: string]: (...arg: never[]) => string;
}