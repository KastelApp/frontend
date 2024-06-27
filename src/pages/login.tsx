import HomeLayout from "@/layouts/HomeLayout.tsx";
import {
	Card,
	Input,
	Link,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";
import { useClientStore, useTokenStore, useTranslationStore } from "@/wrapper/Stores.ts";
import SEO from "@/components/SEO.tsx";
import NextLink from "next/link";
import { useRouter } from "next/router";
import onEnter from "@/utils/onEnter.ts";

const Login = () => {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);
	const router = useRouter();

	const { client } = useClientStore();
	const { setToken } = useTokenStore();

	// ? General state
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// ? Base form state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	// ? Model specific state (e.g. 2FA code)
	// t! 2FA stuff
	// const [twoFaCode, setTwoFaCode] = useState("");
	// const [requiresTwoFa, setRequiresTwoFa] = useState(false);
	// const [twoFaError, setTwoFaError] = useState("");
	// const { onClose, isOpen, onOpenChange } = useDisclosure();

	// ? Captcha Model specific state
	const { isOpen: isOpenCaptcha, onOpenChange: onOpenChangeCaptcha } = useDisclosure();

	const { t } = useTranslationStore();

	useEffect(() => {
		if (email.length > 1 && (!email || !email.includes("@") || !email.includes("."))) {
			setEmailError(t("login.email.error"));
		} else {
			setEmailError("");
		}

		if (password.length > 1 && (!password || password.length < 3)) {
			setPasswordError(t("login.password.error"));
		} else {
			setPasswordError("");
		}
	}, [email, password]);

	const login = async () => {
		if (loading) return;

		let hasError = false;

		// ? Validate email
		if (!email || !email.includes("@") || !email.includes(".")) {
			setEmailError(t("login.email.error"));

			hasError = true;
		} else {
			setEmailError("");
		}

		// ? Validate password
		if (!password || password.length < 3) {
			setPasswordError(t("login.password.error"));

			hasError = true;
		} else {
			setPasswordError("");
		}

		if (emailError || passwordError || hasError) return;

		setLoading(true);

		const attemptLogin = await client.login({
			email,
			password,
			resetClient: true
		});

		if (!attemptLogin.success) {
			if (attemptLogin.errors.captchaRequired) {
				// todo: users should not be able to access this yet
				onOpenChangeCaptcha();
			}

			if (attemptLogin.errors.email) {
				setEmailError(t("login.email.error"));
			}

			if (attemptLogin.errors.password) {
				setPasswordError(t("login.password.error"));
			}

			setLoading(false);

			if (attemptLogin.errors.internalError) {
				setError(t("error.internalServerError"));

				return;
			}

			if (Object.keys(attemptLogin.errors.unknown).length > 0) {
				// ? If for some reason there's an unknown error message, we just show the first one
				// ? Which is why we return for the internal error above (since it would override this one)
				setError(Object.values(attemptLogin.errors.unknown)[0].message);
			}

			return;
		}

		setError("");
		setEmailError("");
		setPasswordError("");

		// ? If we get here, the login was successful so now we can set the token in storage and redirect

		setToken(attemptLogin.token);

		router.push("/app");
	};

	return (
		<>
			<SEO title={"Login"} />

			<HomeLayout>
				<div className="flex justify-center items-center">
					<Card className="flex items-center justify-center mt-32 w-full max-w-md p-8 bg-accent">
						<div className="w-full max-w-md">
							<div className="text-center">
								<h1 className="text-3xl font-bold">{t("login.title")}</h1>
								<p className="text-medium mt-4">{t("login.subtitle")}</p>
							</div>
							<div className="pl-4 pt-3 pb-0 text-danger text-error-500 text-sm text-center">
								{error || "\u00A0"}
							</div>
							<form className="mt-4">
								<div className="flex flex-col space-y-4 items-center">
									<Input
										isClearable
										type="email"
										label={t("login.email.label")}
										variant="bordered"
										placeholder={t("login.email.placeholder")}
										onClear={() => setEmail("")}
										className="max-w-xs"
										description={t("login.email.description")}
										onValueChange={setEmail}
										value={email}
										isRequired
										errorMessage={emailError || t("login.email.error")}
										isInvalid={!!emailError}
										tabIndex={1}
									/>
									<Input
										label={t("login.password.label")}
										variant="bordered"
										placeholder={t("login.password.placeholder")}
										endContent={
											<button className="focus:outline-none" type="button" onClick={toggleVisibility} tabIndex={-1}>
												{isVisible ? (
													<EyeIcon className="text-2xl text-default-400 pointer-events-none" />
												) : (
													<EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
												)}
											</button>
										}
										type={isVisible ? "text" : "password"}
										className="max-w-xs"
										description={t("login.password.description")}
										onValueChange={setPassword}
										value={password}
										isRequired
										errorMessage={passwordError || t("login.password.error")}
										minLength={4}
										maxLength={72}
										isInvalid={!!passwordError}
										onKeyUp={onEnter(login)}
										tabIndex={2}
									/>
								</div>
								<div className="mt-8">
									<Button
										onClick={login}
										size="md"
										color="primary"
										variant="flat"
										className="w-full"
										tabIndex={3}
									>
										{loading ? <LoaderCircle className="text-white animate-spin" /> : t("login.button")}
									</Button>
								</div>
								<div className="mt-4 flex justify-between">
									<Link href="/register" color="primary" className="text-sm" as={NextLink} tabIndex={4}>
										{t("login.register")}
									</Link>
									<Link href="/register" color="primary" className="text-sm" as={NextLink} tabIndex={5}>
										{t("login.forgot")}
									</Link>
								</div>
							</form>
						</div>
					</Card>
				</div>

				<Modal isOpen={isOpenCaptcha} onOpenChange={onOpenChangeCaptcha} placement="top-center">
					<ModalContent>
						<ModalHeader className="flex flex-col gap-1">Beep boop boop?</ModalHeader>
						<ModalBody>
							<div className="flex flex-col items-center">
								<p className="text-md font-semibold text-center">Hmm, are you really human?</p>
								<p className="text-md font-semibold text-center">Complete the captcha below to continue</p>
							</div>
							{/* todo: show captcha */}
						</ModalBody>
					</ModalContent>
				</Modal>
			</HomeLayout>
		</>
	);
};

export default Login;
