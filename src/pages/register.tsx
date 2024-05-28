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
import confetti from "canvas-confetti";
import SEO from "@/components/SEO.tsx";

const Register = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [isConfirmVisible, setIsConfirmVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);
	const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

	// ? General state
	const [error, setError] = useState(""); // ? rarely used

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
	const { onClose: onCloseCaptcha, isOpen: isOpenCaptcha, onOpenChange: onOpenChangeCaptcha } = useDisclosure();

	return (
		<>
			<SEO title={"Register"} />
			<HomeLayout>
				<div className="flex justify-center items-center">
					<Card className="flex items-center justify-center mt-32 w-full max-w-md p-8 bg-accent">
						<div className="w-full max-w-md">
							<div className="text-center">
								<h1 className="text-3xl font-bold">Welcome To Kastel!</h1>
								<p className="text-medium mt-4">Create an account to continue.</p>
							</div>
							<form className="mt-8">
								<div className="flex flex-col space-y-4 items-center">
									<Input
										isClearable
										type="text"
										label="Username"
										variant="bordered"
										placeholder="DarkerInk"
										onClear={() => setUsername("")}
										className="max-w-xs"
										description="The username you want to use on Kastel"
										onValueChange={setUsername}
										value={username}
										isRequired
										errorMessage={usernameError || "Please enter a valid username"}
									/>
									<Input
										isClearable
										type="email"
										label="Email"
										variant="bordered"
										placeholder="kiki@kastelapp.com"
										onClear={() => setEmail("")}
										className="max-w-xs"
										description="The email address you used to sign up"
										onValueChange={setEmail}
										value={email}
										isRequired
										errorMessage={emailError || "Please enter a valid email address"}
									/>
									<Input
										label="Password"
										variant="bordered"
										placeholder="Enter your password"
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
										description="The password to your account"
										onValueChange={setPassword}
										value={password}
										isRequired
										errorMessage={passwordError || "Please enter a valid password"}
										minLength={4}
										maxLength={72}
									/>
									<Input
										label="Confirm Password"
										variant="bordered"
										placeholder="Confirm your password"
										endContent={
											<button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
												{isConfirmVisible ? (
													<EyeIcon className="text-2xl text-default-400 pointer-events-none" />
												) : (
													<EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
												)}
											</button>
										}
										type={isConfirmVisible ? "text" : "password"}
										className="max-w-xs"
										description="Confirm the password to your account"
										onValueChange={setPasswordConfirm}
										value={passwordConfirm}
										isRequired
										errorMessage={passwordConfirmError || "The passwords do not match"}
										minLength={4}
										maxLength={72}
									/>
								</div>
								<div className="mt-8">
									<Button
										onClick={(e) => {
											e.preventDefault();
											const x = e.clientX / window.innerWidth;
											const y = e.clientY / window.innerHeight;

											confetti({
												origin: {
													x,
													y,
												},
												particleCount: 75,
											});
										}}
										size="md"
										color="primary"
										variant="flat"
										className="w-full"
									>
										Register
									</Button>
								</div>
								<div className="mt-4 flex justify-between">
									<Link href="/login" color="primary" className="text-sm">
										Got an account? Login
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
