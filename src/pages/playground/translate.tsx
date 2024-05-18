import { Input, Select, SelectItem } from "@nextui-org/react";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import { useEffect, useState } from "react";
import { MetaData } from "@/utils/Translation.ts";

const Translate = () => {

    const { t, setLanguage, fetchLanguages, currentLanguage } = useTranslationStore();

    const [key, setKey] = useState<string>("");
    const [data, setData] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [langs, setLangs] = useState<MetaData["languages"]>([]);


    useEffect(() => {
        try {
            setOutput(t(key, JSON.parse(data || "{}") as never));
        } catch (e) {
            setOutput("Error: " + (e as Error).message);
        }
    }, [key, data]);

    useEffect(() => {
        setLangs(fetchLanguages());
        console.log("fetching langs")
    }, [fetchLanguages])

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="mt-8 text-center text-2xl font-bold">Translate</p>
                <p className="mt-2 text-center text-2xl font-bold">{t("_debug.title")}</p>
                <p className="mt-2 text-center text-2xl font-bold">{t("_debug.test")}</p>

                <Select
                    color="danger"
                    label="Select Language"
                    placeholder="Select a language"
                    className="max-w-[25vw] mt-4"
                    defaultSelectedKeys={["en"]}
                    onChange={(e) => setLanguage(e.target.value)}
                    selectedKeys={[currentLanguage]}
                >
                    {langs.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.code}</SelectItem>
                    ))}
                </Select>

                <Input placeholder="Enter key" value={key} onChange={(e) => setKey(e.target.value)} className="max-w-[25vw] mt-4" />
                <Input placeholder="Enter data" value={data} onChange={(e) => setData(e.target.value)} className="max-w-[25vw] mt-4" />

                <code className="text-white mt-4 whitespace-pre-wrap">OUTPUT: {output}</code>

                <code className="text-white mt-4 whitespace-pre-wrap">CACHED DATA ({currentLanguage}): {JSON.stringify(langs, null, 4)}</code>
            </div>
        </>
    );
};

export default Translate;