import {
  useChannelStore,
  useGuildStore,
  useUserStore,
  useMessageStore,
  useInviteStore,
  useMemberStore,
  useRoleStore,
  useSettingsStore,
} from "$/utils/Stores.ts";

const createGsetters = (
  store:
    | "channel"
    | "guild"
    | "user"
    | "message"
    | "invite"
    | "member"
    | "role"
    | "settings",
) => {
  return (target: unknown, key: string) => {
    Object.defineProperty(target, key.slice(1), {
      get() {
        return this[key];
      },
      set(value) {
        switch (store) {
          case "channel": {
            const state = useChannelStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          case "guild": {
            const state = useGuildStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          case "user": {
            const state = useUserStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          case "message": {
            const state = useMessageStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          case "invite": {
            const state = useInviteStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          case "member": {
            const state = useMemberStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          case "role": {
            const state = useRoleStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          case "settings": {
            const state = useSettingsStore.getState();

            state.setVersion(state.version + 1);

            break;
          }

          default: {
            throw new Error("Invalid store");
          }
        }

        this[key] = value;
      },
      enumerable: true,
      configurable: true,
    });
  };
};

export default createGsetters;
