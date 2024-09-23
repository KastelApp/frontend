import HomeLayout from "@/layouts/HomeLayout.tsx";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import { Avatar, Card } from "@nextui-org/react";
import SEO from "@/components/SEO.tsx";

interface NormalAcknowledgementData {
	name: string;
	role?: string;
	avatar: string;
	quote: string;
}

interface Library {
	name: string;
	url: string;
	license: string;
	description: string;
}

const AcknowledgementCard = ({ data }: { data: NormalAcknowledgementData[] }) => {
	return (
		<div className="grid grid-cols-4 gap-4">
			{data.map((person, index) => (
				<Card key={index} className="flex flex-col items-center">
					<Avatar src={person.avatar} alt={person.name} className="h-24 w-24" />
					<h3 className="mt-2 text-center text-lg font-semibold">{person.name}</h3>
					{person.role && <p className="text-center text-gray-400">{person.role}</p>}
					<blockquote className="mt-2 max-w-80 text-center text-gray-200">{person.quote}</blockquote>
				</Card>
			))}
		</div>
	);
};

const Libraries = ({ data }: { data: Library[] }) => {
	return (
		<div className="grid max-h-[44rem] grid-cols-2 gap-4 overflow-auto">
			{data.map((library, index) => (
				<Card key={index} className="flex flex-col items-center">
					<h3 className="text-center text-lg font-semibold">{library.name}</h3>
					<p className="text-center text-gray-400">{library.license}</p>
					<p className="text-center text-gray-400">{library.description}</p>
					<a href={library.url} target="_blank" rel="noreferrer" className="text-center text-blue-500 underline">
						Learn More
					</a>
				</Card>
			))}
		</div>
	);
};

const Acknowledgements = () => {
	const kastelStaff: NormalAcknowledgementData[] = [];

	const contributors: NormalAcknowledgementData[] = [];

	const libraries: Library[] = [];

	const { t } = useTranslationStore();

	return (
		<>
			<SEO title={"Acknowledgements"} />
			<HomeLayout>
				<div className="container mx-auto flex flex-col gap-4 p-4">
					<div className="text-center">
						<h2 className="mb-4 text-2xl font-bold">{t("acknowledgements.staff.title")}</h2>
						<p className="text-gray-400">{t("acknowledgements.staff.message")}</p>
					</div>
					<AcknowledgementCard data={kastelStaff} />

					<div className="mt-8 text-center">
						<h2 className="mb-4 text-2xl font-bold">{t("acknowledgements.contributors.title")}</h2>
						<p className="text-gray-400">{t("acknowledgements.contributors.message")}</p>
					</div>
					<AcknowledgementCard data={contributors} />

					<div className="mt-8 text-center">
						<h2 className="mb-4 text-2xl font-bold">{t("acknowledgements.libraries.title")}</h2>
						<p className="text-gray-400">{t("acknowledgements.libraries.message")}</p>
					</div>
					<Libraries data={libraries} />
				</div>
			</HomeLayout>
		</>
	);
};

export default Acknowledgements;
