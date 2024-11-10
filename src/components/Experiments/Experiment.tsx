import React, { useEffect, useState } from "react";

interface ExperimentItemProps {
	experiment?: string;
	priority?: number;
	isDefault?: boolean;
	children: React.ReactNode;
}

interface ExperimentProps {
	children: React.ReactNode;
}

/**
 * This is the experiment item, anything inside of this component will be shown / hidden depending on if the user has access to the experiment
 */
const ExperimentItem: React.FC<ExperimentItemProps> = ({ children }) => {
	// ! While we don't use experiment, priority or isDefault, they are required since we use it in the root Experiment component
	return children;
};

// ? Just so we can locate the component in the tree
ExperimentItem.displayName = "ExperimentItem";

/**
 * This is the experiment root, this will handle all the logic for showing the correct experiments
 */
const Experiment: React.FC<ExperimentProps> = ({ children }) => {
	const [activeExperiments, setActiveExperiments] = useState<string[]>([]);

	useEffect(() => {
		const experiments: {
			experiment: string;
			priority: number;
			isDefault?: boolean;
		}[] = [];

		for (const child of React.Children.toArray(children)) {
			if (React.isValidElement(child) && typeof child.type === "function") {
				const childType = child.type as React.FC;

				if (childType.displayName === "ExperimentItem") {
					experiments.push({
						experiment: child.props.experiment ?? "",
						priority: child.props.priority ?? 0,
						isDefault: child.props.default ?? false,
					});
				}
			}
		}

		experiments.sort((a, b) => b.priority - a.priority);

		// t! actual logic for determining active experiments, for now this stuff isn't used though in the future it may
		const active: string[] = [];

		for (const exp of experiments) {
			if (!exp.isDefault || !active.length) {
				active.push(exp.experiment);
			}
		}

		setActiveExperiments(active);
	}, [children]);

	return (
		<div>
			{activeExperiments.map((experiment) => (
				<div key={experiment}>{experiment}</div>
			))}
		</div>
	);
};

export { Experiment, ExperimentItem };
