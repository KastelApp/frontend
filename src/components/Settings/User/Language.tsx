import { useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";

const Language = () => {
	const [timeFormat, setTimeFormat] = useState("0"); // 0 = 12 hour, 1 = 24 hour
	const [dateFormat, setDateFormat] = useState("0"); // 0 = MM/DD/YYYY, 1 = DD/MM/YYYY, 2 = YYYY/MM/DD
	const [language, setLanguage] = useState("en");

	return (
		<div className="mr-2 rounded-lg bg-lightAccent dark:bg-darkAccent">
			<div className="flex flex-col p-4">
				<h1 className="mb-6 text-2xl font-bold">Language</h1>
				<div className="space-y-6">
					<div>
						<h2 className="mb-2 text-lg font-semibold">Time Format</h2>
						<RadioGroup value={timeFormat} onValueChange={setTimeFormat} className="space-y-2">
							{[
								{ value: "0", label: "12 hour (i.e 5 PM)" },
								{ value: "1", label: "24 hour (i.e 17:00)" },
							].map(({ value, label }) => (
								<div key={value} id={value} className="mb-1 flex w-full rounded-md bg-charcoal-700 p-2">
									<Radio
										className="min-w-full cursor-pointer items-center"
										value={value}
										classNames={{
											label: "min-w-full flex",
										}}
										aria-label={label}
									>
										<span className="flex-1">{label}</span>
									</Radio>
								</div>
							))}
						</RadioGroup>
					</div>
					<div>
						<h2 className="mb-2 text-lg font-semibold">Date Format</h2>
						<RadioGroup value={dateFormat} onValueChange={setDateFormat} className="space-y-2">
							{[
								{ value: "0", label: "MM/DD/YYYY (i.e 12/14/2006)" },
								{ value: "1", label: "DD/MM/YYYY (i.e 14/12/2006)" },
								{ value: "2", label: "YYYY/MM/DD (i.e 2006/12/14)" },
							].map(({ value, label }) => (
								<div key={value} id={value} className="mb-1 flex w-full rounded-md bg-charcoal-700 p-2">
									<Radio
										className="min-w-full cursor-pointer items-center"
										value={value}
										classNames={{
											label: "min-w-full flex",
										}}
										aria-label={label}
									>
										<span className="flex-1">{label}</span>
									</Radio>
								</div>
							))}
						</RadioGroup>
					</div>

					<div>
						<h2 className="mb-2 text-lg font-semibold">Languages</h2>
						<RadioGroup value={language} onValueChange={setLanguage} className="space-y-2">
							{[{ value: "en-us", label: "English" }].map(({ value, label }) => (
								<div key={value} id={value} className="mb-1 flex w-full rounded-md bg-charcoal-700 p-2">
									<Radio
										className="min-w-full cursor-pointer items-center"
										value={value}
										classNames={{
											label: "min-w-full flex",
										}}
										aria-label={label}
									>
										<span className="flex-1">{label}</span>
									</Radio>
								</div>
							))}
						</RadioGroup>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Language;
