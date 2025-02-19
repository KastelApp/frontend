class Logger {
	static colors = {
		purple: (text: string) => Logger.applyColor(text, "#9b59b6"),
		orange: (text: string) => Logger.applyColor(text, "#e67e22"),
		green: (text: string) => Logger.applyColor(text, "#2ecc71"),
		red: (text: string) => Logger.applyColor(text, "#e74c3c"),
		blue: (text: string) => Logger.applyColor(text, "#3498db"),
		yellow: (text: string) => Logger.applyColor(text, "#f1c40f"),
		cyan: (text: string) => Logger.applyColor(text, "#1abc9c"),
		white: (text: string) => Logger.applyColor(text, "#ecf0f1"),
	};

	/**
	 * Apply Colors
	 * @param text The text to apply the color to
	 * @param color The hex color code to apply
	 * @returns The text with the applied color
	 */
	static applyColor(text: string, color: string): string {
		return `%[${color}]<${text}>%`;
	}

	/**
	 * Parse the message and apply the styles
	 * @param message The message to parse
	 */
	static parseMessage(message: string): { parsedMessage: string; styles: string[] } {
		const regex = /%\[#([a-f0-9]{6})\]<([^>]+)>%/gi;
		let parsedMessage = "";
		const styles: string[] = [];
		let lastIndex = 0;

		message.replace(regex, (match, color, text, offset) => {
			parsedMessage += message.slice(lastIndex, offset);
			parsedMessage += "%c" + text + "%c";

			color = color.startsWith("#") ? color : `#${color}`;

			styles.push(`color: ${color}`, "");
			lastIndex = offset + match.length;
			return match;
		});

		parsedMessage += message.slice(lastIndex);
		return { parsedMessage, styles };
	}

	/**
	 * Log something
	 * @param message The thing to log
	 * @param source The source of the log, i.e the file or class. Optional tho can help with debugging
	 */
	static log(message: string, source?: string) {
		const { parsedMessage, styles } = Logger.parseMessage(
			source ? `${Logger.colors.purple(`[${source}]`)} ${message}` : message,
		);
		console.log(parsedMessage, ...styles);
	}

	/**
	 * Log a warning
	 * @param message The message to log
	 * @param source The source of the log (optional tho can help with debugging)
	 */
	static warn(message: string, source?: string) {
		Logger.log(Logger.colors.orange(message), source);
	}

	/**
	 * Log a info message
	 * @param message The message to log
	 * @param source The source of the log (optional tho can help with debugging)
	 */
	static info(message: string, source?: string) {
		Logger.log(Logger.colors.blue(message), source);
	}

	/**
	 * Log a error
	 * @param message The message to log
	 * @param source The source of the log (optional tho can help with debugging)
	 */
	static error(message: string, source?: string) {
		Logger.log(Logger.colors.red(message), source);
	}

	/**
	 * Log a success message
	 * @param message The message to log
	 * @param source The source of the log (optional tho can help with debugging)
	 */
	static success(message: string, source?: string) {
		Logger.log(Logger.colors.green(message), source);
	}

	/**
	 * Log a debug message
	 * @param message The message to log
	 * @param source The source of the log (optional tho can help with debugging)
	 */
	static debug(message: string, source?: string) {
		if (import.meta.env.MODE === "production") return;

		Logger.log(Logger.colors.purple(message), source);
	}
}

export default Logger;
