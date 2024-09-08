import { useState } from "react";
import { Moon, Sun, Monitor, Smile } from "lucide-react";
import { RadioGroup, Radio, Slider } from "@nextui-org/react";
import { Label } from "@/components/ui/label.tsx";

const Appearance = () => {
    const [theme, setTheme] = useState("dark");
    const [navbarLocation, setNavbarLocation] = useState("left");
    const [emojiPack, setEmojiPack] = useState("native");
    const [fontSize, setFontSize] = useState(16);
    const [messageSpacing, setMessageSpacing] = useState(16);

    return (
        <div className="mr-2 rounded-lg bg-lightAccent dark:bg-darkAccent">
            <div className="flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-6">Appearance</h1>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Theme</h2>
                        <RadioGroup value={theme} onValueChange={setTheme} className="space-y-2">
                            {[
                                { value: "dark", label: "Dark", icon: Moon },
                                { value: "light", label: "Light", icon: Sun },
                                { value: "system", label: "Sync with computer", icon: Monitor },
                            ].map(({ value, label, icon: Icon }) => (
                                <div key={value} id={value} className="w-full bg-charcoal-700 rounded-md flex mb-1 p-2">
                                    <Radio className="min-w-full items-center cursor-pointer" value={value} classNames={{
                                        label: "min-w-full flex"
                                    }} aria-label={label}>
                                        <Icon className="w-5 h-5 mr-2" />
                                        <span className="flex-1">{label}</span>
                                    </Radio>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">NavBar Location</h2>
                        <p className="mb-2 text-sm text-gray-400">Changes where the Guild & DM's are placed.</p>
                        <RadioGroup value={navbarLocation} onValueChange={setNavbarLocation} className="space-y-2">
                            {[
                                { value: "left", label: "Left: Guild list is on the left side." },
                                { value: "bottom", label: "Bottom: Guild list is on the bottom." },
                            ].map(({ value, label }) => (
                                <div key={value} id={value} className="w-full bg-charcoal-700 rounded-md flex mb-1 p-2">
                                    <Radio className="min-w-full items-center cursor-pointer" value={value} classNames={{
                                        label: "min-w-full flex"
                                    }} aria-label={label}>
                                        <span className="flex-1">{label}</span>
                                    </Radio>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Emoji Pack</h2>
                        <p className="mb-2 text-sm text-gray-400">Choose which style of emojis you'd like to use</p>
                        <RadioGroup value={emojiPack} onValueChange={setEmojiPack} className="space-y-2">
                            {[
                                { value: "native", label: "Native", icon: Moon },
                                { value: "twemoji", label: "Twemoji (Twitter)", icon: Sun },
                                { value: "noto-emoji", label: "Noto Emoji (Google)", icon: Monitor },
                                { value: "fluentui-emoji", label: "Fluent UI Emoji (Microsoft)", icon: Smile },
                            ].map(({ value, label, icon: Icon }) => (
                                <div key={value} id={value} className="w-full bg-charcoal-700 rounded-md flex mb-1 p-2">
                                    <Radio className="min-w-full items-center cursor-pointer" value={value} classNames={{
                                        label: "min-w-full flex"
                                    }} aria-label={label}>
                                        <Icon className="w-5 h-5 mr-2" />
                                        <span className="flex-1">{label}</span>
                                    </Radio>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Message Display</h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fontSize" className="text-sm text-gray-400">Chat Font Scaling</Label>
                                <div className="flex items-center space-x-4">
                                    <Slider
                                        id="fontSize"
                                        value={[fontSize]}
                                        onChange={(value) => setFontSize(value as number)}
                                        maxValue={24}
                                        minValue={12}
                                        step={1}
                                        className="w-full"
                                    />
                                    <span className="w-12 text-right">{fontSize}px</span>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="messageSpacing" className="text-sm text-gray-400">Space Between Message Groups</Label>
                                <div className="flex items-center space-x-4">
                                    <Slider
                                        id="messageSpacing"
                                        value={[messageSpacing]}
                                        onChange={(value) => setMessageSpacing(value as number)}
                                        className="w-full"
                                        step={1}
                                        maxValue={32}
                                        minValue={2}
                                    />
                                    <span className="w-12 text-right">{messageSpacing}px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appearance;