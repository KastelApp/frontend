import { useEffect, useState } from "react";
import { US, DE } from "country-flag-icons/react/3x2";
import { Select, SelectItem } from "@nextui-org/react";
import Link from "@/components/Link.tsx";

interface SupportedLanguages {
	language: string;
	codes: string[];
	icon: React.ReactNode;
	id: string;
}

// t! Work on this file since we've added translation support

const Language = () => {
	const currentSupportedLanguages: SupportedLanguages[] = [
		{
			codes: ["en-US", "en", "en-GB"],
			icon: <US className="h-8 w-8" />,
			language: "English",
			id: "en",
		},
		{
			codes: ["de-DE", "de"],
			icon: <DE className="h-8 w-8" />,
			language: "Deutsch",
			id: "de",
		},
	];

	const [selectedLanguage, setSelectedLanguage] = useState<string>("");

	const [notFound, setNotFound] = useState<boolean>(false);

	useEffect(() => {
		const userLanguage = navigator.language;

		const supportedLanguage = currentSupportedLanguages.find((language) => language.codes.includes(userLanguage));

		if (supportedLanguage) {
			setSelectedLanguage(supportedLanguage.id);
		} else {
			setNotFound(true);
		}
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<p className="text-center text-white">Select your preferred language</p>
			{notFound && (
				<p className="text-center text-white">
					We currently do not have your preferred language ({navigator.language}
					), though you can help us translate it{" "}
					<Link className="text-blue-500" href="https://github.com/KastelApp" target="_blank">
						here
					</Link>
				</p>
			)}

			<Select
				label="Select Language"
				className="mx-auto w-96"
				items={currentSupportedLanguages.map((language) => language.id) as Iterable<string[]>}
				onChange={(value) => setSelectedLanguage(value.target.value)}
				selectedKeys={[selectedLanguage]}
				renderValue={(value) => {
					return value.map((val) => {
						const foundKey = currentSupportedLanguages.find((language) => language.id === val.key);

						if (!foundKey) {
							return null;
						}

						return (
							<div className="flex items-center gap-2" key={foundKey.id}>
								{foundKey.icon}
								<p className="text-white">{foundKey.language}</p>
							</div>
						);
					});
				}}
			>
				{currentSupportedLanguages.map((language) => (
					<SelectItem key={language.id} value={language.id} startContent={language.icon}>
						{language.language}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};

export default Language;
