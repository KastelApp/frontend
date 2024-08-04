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
import confetti from "canvas-confetti";
import SEO from "@/components/SEO.tsx";
import NextLink from "next/link";
import { useClientStore, useTokenStore, useTranslationStore } from "@/wrapper/Stores.ts";
import { useRouter } from "next/router";
import onEnter from "@/utils/onEnter.ts";

const Register = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [isConfirmVisible, setIsConfirmVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);
	const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

	const { client } = useClientStore();
	const { t } = useTranslationStore();
	const { setToken } = useTokenStore();
	const router = useRouter();

	// ? General state
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// ? Base form state
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordConfirmError, setPasswordConfirmError] = useState("");

	// ? Captcha Model specific state
	const { isOpen: isOpenCaptcha, onOpenChange: onOpenChangeCaptcha } = useDisclosure();

	useEffect(() => {
		if (username.length > 1 && (!username || username.length < 3)) {
			setUsernameError(t("register.username.error"));
		} else {
			setUsernameError("");
		}

		if (email.length > 1 && (!email || !email.includes("@") || !email.includes("."))) {
			setEmailError(t("register.email.error"));
		} else {
			setEmailError("");
		}

		if (password.length > 1 && (!password || password.length < 4)) {
			setPasswordError(t("register.password.error"));
		} else {
			setPasswordError("");
		}

		if (passwordConfirm.length > 1 && (!passwordConfirm || passwordConfirm !== password)) {
			setPasswordConfirmError(t("register.password.confirm.error"));
		} else {
			setPasswordConfirmError("");
		}
	}, [username, email, password, passwordConfirm]);

	const register = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent) => {
		if (loading) return;

		let hasError = false;

		// ? Validate username
		if (!username || username.length < 3) {
			setUsernameError(t("register.username.error"));

			hasError = true;
		} else {
			setUsernameError("");
		}

		// ? Validate email
		if (!email || !email.includes("@") || !email.includes(".")) {
			setEmailError(t("register.email.error"));

			hasError = true;
		} else {
			setEmailError("");
		}

		// ? Validate password & confirm password
		if (!password || password.length < 4) {
			setPasswordError(t("register.password.error"));

			hasError = true;
		} else {
			setPasswordError("");
		}

		if (!passwordConfirm || passwordConfirm !== password) {
			setPasswordConfirmError(t("register.password.confirm.error"));

			hasError = true;
		} else {
			setPasswordConfirmError("");
		}

		if (usernameError || emailError || passwordError || passwordConfirmError || hasError) return;

		setLoading(true);

		const attemptRegister = await client.register({
			email,
			password,
			username,
			resetClient: true,
		});


		if (!attemptRegister.success) {
			if (attemptRegister.errors.captchaRequired) {
				onOpenChangeCaptcha();
			}

			if (attemptRegister.errors.email) {
				setEmailError(t("register.email.error"));
			}

			if (attemptRegister.errors.password) {
				setPasswordError(t("register.password.error"));
			}

			if (attemptRegister.errors.username) {
				setUsernameError(t("register.username.error"));
			}

			setLoading(false);

			if (attemptRegister.errors.internalError) {
				setError(t("error.internalServerError"));
				return;
			}

			if (Object.keys(attemptRegister.errors).length > 0) {
				setError(Object.values(attemptRegister.errors.unknown)[0].message);
			}

			return;
		}

		// const x = e.clientX / window.innerWidth;
		// const y = e.clientY / window.innerHeight;
		// ? do clientx and y if its a mouse event else use bounding client rect
		const x = "clientX" in e ? e.clientX / window.innerWidth : e.currentTarget.getBoundingClientRect().x;
		const y = "clientY" in e ? e.clientY / window.innerHeight : e.currentTarget.getBoundingClientRect().y;

		confetti({
			origin: {
				x,
				y,
			},
			particleCount: 75,
		});

		setToken(attemptRegister.token);

		setTimeout(() => {
			router.push("/app");
		}, 1000);
	}

	return (
		<>
			<SEO title={"Register"} />
			<HomeLayout>
				<div className="flex justify-center items-center">
					<Card className="flex items-center justify-center mt-32 w-full max-w-md p-8 bg-lightAccent dark:bg-darkAccent">
						<div className="w-full max-w-md">
							<div className="text-center">
								<h1 className="text-3xl font-bold">{t("register.title")}</h1>
								<p className="text-medium mt-4">{t("register.subtitle")}</p>
							</div>
							<div className="pl-4 pt-3 pb-0 text-danger text-error-500 text-sm text-center">
								{error || "\u00A0"}
							</div>
							<form className="mt-4">
								<div className="flex flex-col space-y-4 items-center">
									<Input
										isClearable
										type="text"
										label={t("register.username.label")}
										variant="bordered"
										placeholder={t("register.username.placeholder")}
										onClear={() => setUsername("")}
										className="max-w-xs"
										description={t("register.username.description")}
										onValueChange={setUsername}
										value={username}
										isRequired
										errorMessage={usernameError || t("register.username.error")}
										isInvalid={!!usernameError}
										minLength={3}
										tabIndex={1}
									/>
									<Input
										isClearable
										type="email"
										label={t("register.email.label")}
										variant="bordered"
										placeholder={t("register.email.placeholder")}
										onClear={() => setEmail("")}
										className="max-w-xs"
										description={t("register.email.description")}
										onValueChange={setEmail}
										value={email}
										isRequired
										errorMessage={emailError || t("register.email.error")}
										isInvalid={!!emailError}
										tabIndex={2}
									/>
									<Input
										label={t("register.password.label")}
										variant="bordered"
										placeholder={t("register.password.placeholder")}
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
										description={t("register.password.description")}
										onValueChange={setPassword}
										value={password}
										isRequired
										errorMessage={passwordError || t("register.password.error")}
										minLength={4}
										maxLength={72}
										isInvalid={!!passwordError}
										tabIndex={3}
									/>
									<Input
										label={t("register.password.confirm.label")}
										variant="bordered"
										placeholder={t("register.password.confirm.placeholder")}
										endContent={
											<button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility} tabIndex={-1}>
												{isConfirmVisible ? (
													<EyeIcon className="text-2xl text-default-400 pointer-events-none" />
												) : (
													<EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
												)}
											</button>
										}
										type={isConfirmVisible ? "text" : "password"}
										className="max-w-xs"
										description={t("register.password.confirm.description")}
										onValueChange={setPasswordConfirm}
										value={passwordConfirm}
										isRequired
										errorMessage={passwordConfirmError || t("register.password.confirm.error")}
										minLength={4}
										maxLength={72}
										isInvalid={!!passwordConfirmError}
										onKeyUp={onEnter(register, true)}
										tabIndex={4}
									/>
								</div>
								<div className="mt-8">
									<Button
										onClick={register}
										size="md"
										color="primary"
										variant="flat"
										className="w-full"
										tabIndex={5}
									>
										{loading ? <LoaderCircle className="animate-spin" size={24} /> : t("register.button")}
									</Button>
								</div>
								<div className="mt-4 flex justify-between">
									<Link href="/login" color="primary" className="text-sm" as={NextLink}>
										{t("register.login")}
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

export default Register;
