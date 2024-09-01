import { Button } from "@nextui-org/react";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const SaveChanges = ({
	onCancel,
	onSave,
	isShowing,
	isLoading = false,
}: {
	onSave: () => void;
	onCancel: () => void;
	isShowing: boolean;
	isLoading?: boolean;
}) => {
	return (
		<div className="select-none pb-20">
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: isShowing ? 0 : 100, opacity: isShowing ? 1 : 0 }}
				transition={{ type: "spring", stiffness: 500, damping: 30 }}
				className="absolute bottom-8 left-[8%] !z-[120] flex h-14 w-[85%] items-center justify-center rounded-lg border-2 border-gray-700 bg-darkAccent sm:left-[22%] sm:w-[75%]"
			>
				<div className="flex w-full items-center justify-between px-4">
					<p className="text-md font-semibold text-white">Be careful, you have unsaved changes.</p>
					<div className="flex gap-2">
						<Button onClick={onCancel} radius="none" variant="flat" color="danger" className="h-8 rounded-md">
							Cancel
						</Button>
						<Button
							onClick={() => {
								if (isLoading) return;

								onSave();
							}}
							radius="none"
							variant="flat"
							color="success"
							className="h-8 rounded-md"
						>
							{isLoading ? <LoaderCircle className="custom-animate-spin text-white" size={20} /> : "Save"}
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default SaveChanges;
