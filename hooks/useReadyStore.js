import { useSetRecoilState } from 'recoil';
import { readyStore } from '@/utils/stores'

export const useReadyStoreUpdater = () => {
    const setReadyState = useSetRecoilState(readyStore);

    const handleUnready = () => {
        setReadyState(false);
    };

    return {
        handleUnready,
    };
}