import { useTranslationStore } from "@/wrapper/Stores.tsx";

const Translation = () => {
    const { markdownT: newT } = useTranslationStore();

    return (
        <div>
            {newT("_debug.markdown")}
        </div>
    )
}

export default Translation;