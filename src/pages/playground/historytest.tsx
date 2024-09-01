import SaveChanges from "@/components/SaveChanges.tsx";
import { useMultiFormState } from "@/hooks/useStateForm.ts";
import { Input } from "@nextui-org/react";

const HistoryTest = () => {
	const { text, text2, text3, isDirty, save, reset } = useMultiFormState({
		text: "123",
		text2: "123",
		text3: "123",
	});

	return (
		<div className="flex flex-col">
			<Input value={text.state} onChange={(e) => text.set(e.target.value)} />
			<Input value={text2.state} onChange={(e) => text2.set(e.target.value)} />
			<Input value={text3.state} onChange={(e) => text3.set(e.target.value)} />

			<SaveChanges isShowing={isDirty} onCancel={reset} onSave={save} />
		</div>
	);
};

export default HistoryTest;
