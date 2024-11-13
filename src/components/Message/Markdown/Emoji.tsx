// import { snowflake } from "@/data/constants.ts";
import SimpleMarkdown from "@kastelapp/simple-markdown";
// import { findEmoji } from "@/utils/parser.ts";

const Emoji = ({
	id,
	isAnimated,
	name,
	// isCustom
}: {
	name: string;
	id: string | null;
	isAnimated: boolean;
	isCustom: boolean;
}) => {
	// const isSnowflake = snowflake.validate(name);
	// const foundEmoji = !isCustom ? findEmoji(name, "name") : null;
	const foundEmoji = null;

	console.log(id, name, isAnimated, foundEmoji);

	return <>{JSON.stringify(foundEmoji)} | a</>;
};

export const emoji = {
	order: SimpleMarkdown.defaultRules.text.order,
	match: (source: string) => /^<(a?):([^\s:]+):(\d+)>|^:([^\s:]+):/g.exec(source),
	parse: (match: string[]) => ({
		isAnimated: Boolean(match[1]),
		name: match[2] ?? match[4],
		id: match[3] ?? null,
		isCustom: Boolean(match[3]),
	}),

	react: (
		{
			id,
			isAnimated,
			name,
			isCustom,
		}: {
			isAnimated: boolean;
			name: string;
			id: string | null;
			isCustom: boolean;
		},
		_: unknown,
		state: { key: string },
	) => <Emoji id={id} isAnimated={isAnimated} isCustom={isCustom} name={name} key={state.key} />,
};

export default Emoji;
