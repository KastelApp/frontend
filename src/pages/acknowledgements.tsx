import HomeLayout from "@/layouts/HomeLayout.tsx";
import { Avatar, Card } from "@nextui-org/react";

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

const AcknowledgementCard = ({ data }: { data: NormalAcknowledgementData[]; }) => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {data.map((person, index) => (
                <Card key={index} className="flex flex-col items-center">
                    <Avatar src={person.avatar} alt={person.name} className="w-24 h-24" />
                    <h3 className="text-center mt-2 text-lg font-semibold">{person.name}</h3>
                    {person.role && <p className="text-center text-gray-400">{person.role}</p>}
                    <blockquote className="text-center mt-2 text-gray-200 max-w-80">{person.quote}</blockquote>
                </Card>
            ))}
        </div>
    );
};



const Libraries = ({ data }: { data: Library[]; }) => {
    return (
        <div className="grid grid-cols-2 gap-4 overflow-auto max-h-[44rem]">
            {data.map((library, index) => (
                <Card key={index} className="flex flex-col items-center">
                    <h3 className="text-center text-lg font-semibold">{library.name}</h3>
                    <p className="text-center text-gray-400">{library.license}</p>
                    <p className="text-center text-gray-400">{library.description}</p>
                    <a href={library.url} target="_blank" rel="noreferrer" className="text-center text-blue-500 underline">Learn More</a>
                </Card>
            ))}
        </div>
    );
};



const Acknowledgements = () => {
    const kastelStaff: NormalAcknowledgementData[] = [

    ];

    const contributors: NormalAcknowledgementData[] = [

    ];

    const libraries: Library[] = [

    ];

    return (
        <HomeLayout>
            <div className="container mx-auto p-4 flex flex-col gap-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Meet the Staff</h2>
                    <p className="text-gray-400">The people who make Kastel possible.</p>
                </div>
                <AcknowledgementCard data={kastelStaff} />

                <div className="text-center mt-8">
                    <h2 className="text-2xl font-bold mb-4">Contributors</h2>
                    <p className="text-gray-400">The people who help make Kastel better.</p>
                </div>
                <AcknowledgementCard data={contributors} />

                <div className="text-center mt-8">
                    <h2 className="text-2xl font-bold mb-4">Libraries</h2>
                    <p className="text-gray-400">Without these libraries, Kastel wouldn't be possible, please check them out!</p>
                </div>
                <Libraries data={libraries} />
            </div>
        </HomeLayout>
    );
};

export default Acknowledgements;