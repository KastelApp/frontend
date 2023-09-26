export interface LastChannelCache {
    [key: string]: string;
}

export interface Modal {
    id: string;
    textInputOptions: {
        id: string;
        value: string;
    }[];
    checkboxeOptions: {
        id: string;
        enabled: boolean;
    }[];
}