import { useNavigate, useLocation, useParams, useMatch as matchHook, type PathMatch } from "react-router-dom";

// ? required so react-compiler doesn't throw a fit, there should be zero issues doing this.
const matcher = matchHook;

/**
 * A simple hook which mimics the useRouter hook from Next.js.
 * @returns The router object
 */
export const useRouter = (): {
	push: (path: string) => void;
	replace: (path: string) => void;
	back: () => void;
	forward: () => void;

	pathname: string;
	query: URLSearchParams;
	params: Record<string, string | string[] | undefined>;

	match: (pattern: string) => PathMatch<string> | null;

	/**
	 * Params are always available, so this is always true, this is mainly just for compatibility since i'm too lazy to change the code
	 */
	isReady: boolean;
} => {
	const navigate = useNavigate();
	const location = useLocation();
	const rawParams = useParams();

	const push = (path: string) => navigate(path);
	const replace = (path: string) => navigate(path, { replace: true });
	const match = (pattern: string) => matcher(pattern);

	const back = () => navigate(-1);
	const forward = () => navigate(1);

	return {
		push,
		replace,
		back,
		forward,

		pathname: location.pathname,
		query: new URLSearchParams(location.search),
		params: Object.fromEntries(
			Object.entries(rawParams).map(([key, value]) => {
				if (key === "*") {
					// ? for the most part I think this makes sense? at least its how next handled it?
					return ["slug", value?.split("/")];
				}

				return [key, value];
			}),
		),

		match,
		isReady: true,
	};
};
