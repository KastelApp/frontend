import Translation from "./translation.ts";
import Client from "$/Client/Client.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware"

interface ReadyStore {
  ready: boolean;
  setReady: (ready: boolean) => void;
}

export const useReadyStore = create<ReadyStore>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
}));

interface TokenStore {
  token: string | null;
  setToken: (token: string) => void;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set(() => ({ token: token })),
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set(() => ({ _hasHydrated: hasHydrated })),
    }),
    {
      name: "token",
      onRehydrateStorage: () => (state) => {
        state!.setHasHydrated(true);
      },
    },
  ),
);

interface ClientStore {
  client: Client;
  setClient: (client: Client) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  client: null as unknown as Client,
  setClient: (client) => set(() => ({ client })),
}));

interface CantConnectStore {
  cantConnect: boolean;
  setCantConnect: (cantConnect: boolean) => void;
}

export const useCantConnectStore = create<CantConnectStore>((set) => ({
  cantConnect: false,
  setCantConnect: (cantConnect) => set(() => ({ cantConnect })),
}));

interface LastChannelCache {
  lastChannelCache: Record<string, string>;
  setLastChannelCache: (lastChannelCache: Record<string, string>) => void;
  removeChannelFromCache: (guildId: string) => void;
}

export const useLastChannelCache = create<LastChannelCache>()(
  persist(
    (set, get) => ({
      lastChannelCache: {},
      setLastChannelCache: (lastChannelCache) => set(() => ({ lastChannelCache })),
      removeChannelFromCache: (guildId) => {
        const lastChannelCache = get().lastChannelCache;
        delete lastChannelCache[guildId];
        set(() => ({ lastChannelCache }));
      },
    }),
    {
      name: "lastChannelCache",
    },
  ),
);

interface CollapsedChannels {
  collapsedChannels: string[];
  setCollapsedChannels: (collapsedChannels: string[]) => void;
}

export const useCollapsedChannels = create<CollapsedChannels>()(
  persist(
    (set) => ({
      collapsedChannels: [],
      setCollapsedChannels: (collapsedChannels) => set(() => ({ collapsedChannels })),
    }),
    {
      name: "collapsedChannels",
    },
  ),
);

interface IsDesktop {
  isDesktop: boolean;
  setIsDesktop: (isDesktop: boolean) => void;
}

export const useIsDesktop = create<IsDesktop>((set) => ({
  isDesktop: false,
  setIsDesktop: (isDesktop) => set(() => ({ isDesktop })),
}));

interface TranslationStore {
  translation: Translation;
  setTranslation: (translation: Translation) => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
  translation: new Translation(),
  setTranslation: (translation) => set(() => ({ translation })),
}));

interface LastStatusStore {
  lastStatus: string;
  setLastStatus: (lastStatus: string) => void;
}

export const useLastStatusStore = create<LastStatusStore>((set) => ({
  lastStatus: "",
  setLastStatus: (lastStatus) => set(() => ({ lastStatus })),
}));

interface ExperimentsStore {
  experiments: {
    newChatBox: boolean;
  }
  setExperiments: (settings: { newChatBox: boolean; }) => void;
}

export const usePresistantSettings = create<ExperimentsStore>()(
  persist(
    (set) => ({
      experiments: {
        newChatBox: false,
      },
      setExperiments: (experiments) => set(() => ({ experiments })),
    }),
    {
      name: "experiments",
    },
  ),
);