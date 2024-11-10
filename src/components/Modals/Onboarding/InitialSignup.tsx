import { Modal, ModalContent, ModalBody, Button, Divider, ModalHeader, ModalFooter } from "@nextui-org/react";
import { Check } from "lucide-react";
import { useState } from "react";
import cn from "@/utils/cn.ts";
import Language from "./Language.tsx";
import Appearance from "./Appearance.tsx";

// note: Currently this is a WIP and will not be shown after signup, in the future it should though
// note: the reasoning is due to the fact of idk what else to show nor how I want to show it

interface Steps {
	title: string;
	id: string;
	danger?: boolean;
}

const CheckStep = ({
	stepNumber,
	isComplete,
	isDanger,
	isSelected,
}: {
	stepNumber: number;
	isComplete?: boolean;
	isDanger?: boolean;
	isSelected?: boolean;
}) => {
	const transitionClasses = "transition-all duration-300 ease-in-out";

	const completeColor = isDanger ? "bg-danger border-danger" : "bg-blue-600 text-white border-blue-600";
	const outlineColor = isDanger ? "border-danger" : "border-blue-600";
	const selectedColor = isDanger
		? "bg-danger border-danger bg-opacity-40"
		: "bg-blue-600 text-white border-blue-600 bg-opacity-40";

	return (
		<div className="flex items-center justify-center rounded-full">
			<div
				className={cn(
					"flex h-10 w-10 items-center justify-center rounded-full border-3",
					isComplete ? completeColor : outlineColor,
					isSelected ? selectedColor : "",
					transitionClasses,
				)}
			>
				{isComplete ? (
					<Check size={22} className={transitionClasses} />
				) : (
					<span className={transitionClasses}>{stepNumber}</span>
				)}
			</div>
		</div>
	);
};

const Step = ({
	title,
	index,
	danger,
	isSelected,
	isComplete,
	onPress,
}: Steps & {
	isSelected?: boolean;
	isComplete?: boolean;
	index: number;
	onPress?: () => void;
}) => {
	return (
		<div
			className={cn("flex items-center justify-center gap-2", onPress ? "cursor-pointer" : "")}
			onClick={onPress}
		>
			<CheckStep stepNumber={index} isComplete={isComplete} isDanger={danger} isSelected={isSelected} />
			<p className="text-white">{title}</p>
		</div>
	);
};

const Steps = ({
	steps,
	currentSelected,
	isFinished,
	setStep,
}: {
	steps: Steps[];
	currentSelected: string;
	isFinished?: boolean;
	setStep?: (step: string) => void;
}) => {
	return (
		<div className="flex select-none items-center justify-center gap-4">
			{steps.map((step, index) => (
				<Step
					key={step.id}
					index={index + 1}
					{...step}
					isSelected={isFinished ? false : step.id === currentSelected}
					isComplete={isFinished === true ? true : steps.findIndex((step) => step.id === currentSelected) > index}
					onPress={setStep ? () => setStep(step.id) : undefined}
				/>
			))}
		</div>
	);
};

const InitialSignup = () => {
	const steps: Steps[] = [
		{ title: "Language", id: "lang" },
		{ title: "Appearance", id: "app" },
		{ title: "Setup Profile", id: "profile" },
		// { title: "Privacy Settings", id: "privacy" } // todo: add privacy settings
	];

	const [currentStep, setCurrentStep] = useState<string>(steps[0].id);
	const [isFinished, setIsFinished] = useState<boolean>(false);

	return (
		<>
			<Modal size="5xl" isOpen hideCloseButton placement="center" className="z-50 w-[100vw]">
				<ModalContent>
					<ModalHeader>
						<div className="flex w-full flex-col items-center justify-center gap-4">
							<p className="">Welcome to Kastel, DarkerInk. Let's get you setup.</p>
							<div className="flex w-full items-center justify-center">
								<Steps steps={steps} currentSelected={currentStep} isFinished={isFinished} />
							</div>
							<Divider />
						</div>
					</ModalHeader>
					<ModalBody>
						{currentStep === "lang" && <Language />}
						{currentStep === "app" && <Appearance />}
						{/* You are at: {currentStep} ({steps.findIndex((step) => step.id === currentStep) + 1}/{steps.length}) - {steps[steps.findIndex((step) => step.id === currentStep)].title} ({isFinished ? "Finished" : "Not Finished"}) */}
					</ModalBody>
					<ModalFooter className="flex items-center justify-center">
						<div className="flex items-center justify-center gap-4">
							<Button
								color="danger"
								onPress={() => {
									if (currentStep === steps[0].id) {
										return;
									}

									if (currentStep === steps[steps.length - 1].id && isFinished) {
										setIsFinished(false);

										return;
									}

									setCurrentStep(steps[steps.findIndex((step) => step.id === currentStep) - 1].id);
								}}
								variant="flat"
								isDisabled={steps[0].id === currentStep}
							>
								Previous
							</Button>
							<Button
								color="success"
								onPress={() => {
									if (currentStep === steps[steps.length - 1].id) {
										setIsFinished(true);
										return;
									}

									setCurrentStep(steps[steps.findIndex((step) => step.id === currentStep) + 1].id);
								}}
								variant="flat"
								isDisabled={isFinished}
							>
								{currentStep === steps[steps.length - 1].id ? "Finish" : "Next"}
							</Button>
						</div>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default InitialSignup;
