import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useRef, useState } from "react";

const TwoFa = ({
	isOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {
	const [value, setValue] = useState<string[]>(Array(6).fill("|"));
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
		const newValue = e.target.value;
		if (newValue === "") {
			setValue((prev) => [...prev.slice(0, i), "|", ...prev.slice(i + 1)]);
			return;
		}

		if (isNaN(parseInt(newValue))) return;

		setValue((prev) => [...prev.slice(0, i), newValue, ...prev.slice(i + 1)]);
		if (i < inputRefs.current.length - 1) inputRefs.current[i + 1]?.focus();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
		if (e.key === "Backspace") {
			if (value[i] === "|") {
				if (i > 0) {
					inputRefs.current[i - 1]?.focus();
				}
			} else {
				setValue((prev) => [...prev.slice(0, i), "|", ...prev.slice(i + 1)]);
			}
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, i: number) => {
		const pasteData = e.clipboardData.getData("text").slice(0, 6 - i);
		const newValue = value.slice();
		for (let j = 0; j < pasteData.length; j++) {
			if (!isNaN(parseInt(pasteData[j]))) {
				newValue[i + j] = pasteData[j];
			}
		}
		setValue(newValue);
		if (i + pasteData.length < inputRefs.current.length) {
			inputRefs.current[i + pasteData.length]?.focus();
		} else {
			inputRefs.current[inputRefs.current.length - 1]?.focus();
		}
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" isDismissable={false}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Enter your 2FA Codes</ModalHeader>
				<ModalBody>
					<div className="flex gap-2">
						{[...Array(6)].map((_, i) => (
							<Input
								key={i}
								// @ts-expect-error -- its fine
								ref={(el) => (inputRefs.current[i] = el)}
								value={(value[i] === "|" ? "" : value[i]) || ""}
								onChange={(e) => handleChange(e, i)}
								onKeyDown={(e) => handleKeyDown(e, i)}
								onPaste={(e) => handlePaste(e, i)}
								maxLength={1}
								variant="bordered"
								className="w-12 rounded-none"
							/>
						))}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="flat" onPress={onClose}>
						Cancel
					</Button>
					<Button color="success" variant="flat" onPress={onClose}>
						Submit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default TwoFa;
