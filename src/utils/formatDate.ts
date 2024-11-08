export type DateFormat = "relative" | "dayTime" | "detailed" | "short";

/**
 * Formats a date, if it was sent today it would show "Today at 12:00 PM", if it was sent yesterday it would show "Yesterday at 12:00 PM", if it was sent before that it would show "4/20/2024 12:00 PM" and if it was sent tomorrow it would show "Tomorrow at 12:00 PM
 */
const formatDate = (date: Date, format: DateFormat = "relative"): string => {
	const now = new Date();

	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	const dateOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	const getRelativeTime = (past: Date): string => {
		const units: { unit: Intl.RelativeTimeFormatUnit; ms: number; }[] = [
			{ unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
			{ unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
			{ unit: "day", ms: 1000 * 60 * 60 * 24 },
			{ unit: "hour", ms: 1000 * 60 * 60 },
			{ unit: "minute", ms: 1000 * 60 },
			{ unit: "second", ms: 1000 },
		];

		const elapsed = now.getTime() - past.getTime();
		const direction = elapsed < 0 ? 1 : -1;

		for (const { unit, ms } of units) {
			const diff = Math.abs(elapsed) / ms;
			if (diff >= 1) {
				const roundedDiff = Math.floor(diff) * direction;
				return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
					roundedDiff,
					unit
				);
			}
		}
		return "Just now";
	};

	switch (format) {
		case "short": {
			return date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "numeric",
			});
		}

		case "relative": {
			const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

			if (diffDays < 0) {
				return `Tomorrow at ${date.toLocaleTimeString("en-US", timeOptions)}`;
			}

			if (diffDays === 0) {
				return `Today at ${date.toLocaleTimeString("en-US", timeOptions)}`;
			} else if (diffDays === 1) {
				return `Yesterday at ${date.toLocaleTimeString("en-US", timeOptions)}`;
			}

			return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-US", timeOptions)}`;
		}

		case "dayTime": {
			return `${date.toLocaleDateString("en-US", {
				weekday: "long",
				...dateOptions,
			})}, ${date.toLocaleTimeString("en-US", timeOptions)}`;
		}

		case "detailed": {
			return getRelativeTime(date);
		}
	}
};


export default formatDate;

export { formatDate };