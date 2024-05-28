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
	ModalFooter,
	Button,
} from "@nextui-org/react";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import SEO from "@/components/SEO.tsx";

const Login = () => {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	// ? General state
	const [error, setError] = useState(""); // ? rarely used

	// ? Base form state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	// ? Model specific state (e.g. 2FA code)
	const [twoFaCode, setTwoFaCode] = useState("");
	const [requiresTwoFa, setRequiresTwoFa] = useState(false);
	const [twoFaError, setTwoFaError] = useState("");
	const { onClose, isOpen, onOpenChange } = useDisclosure();

	// ? Captcha Model specific state
	const { onClose: onCloseCaptcha, isOpen: isOpenCaptcha, onOpenChange: onOpenChangeCaptcha } = useDisclosure();

	const { t } = useTranslationStore();

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
							<form className="mt-8">
								<div className="flex flex-col space-y-4 items-center">
									<Input
										isClearable
										type="email"
										label={t("login.email.label")}
										variant="bordered"
										placeholder="kiki@kastelapp.com"
										onClear={() => setEmail("")}
										className="max-w-xs"
										description={t("login.email.description")}
										onValueChange={setEmail}
										value={email}
										isRequired
										errorMessage={emailError || t("login.email.error")}
									/>
									<Input
										label={t("login.password.label")}
										variant="bordered"
										placeholder={t("login.password.placeholder")}
										endContent={
											<button className="focus:outline-none" type="button" onClick={toggleVisibility}>
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
									/>
								</div>
								<div className="mt-8">
									<Button
										onClick={() => {
											// ? Validate email
											if (!email) {
												setEmailError("Please enter a valid email address");
											} else {
												setEmailError("");
											}

											// ? Validate password
											if (!password) {
												setPasswordError("Please enter a valid password");
											} else {
												setPasswordError("");
											}

											// ? If there are no errors, continue
											if (!emailError && !passwordError) {
												// ? Show 2FA model
												if (requiresTwoFa) {
													onOpenChange();
												} else {
													// ? Show captcha model
													onOpenChangeCaptcha();
												}
											}
										}}
										size="md"
										color="primary"
										variant="flat"
										className="w-full"
									>
										{t("login.button")}
									</Button>
								</div>
								<div className="mt-4 flex justify-between">
									<Link href="/register" color="primary" className="text-sm">
										{t("login.register")}
									</Link>
									<Link href="/register" color="primary" className="text-sm">
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
