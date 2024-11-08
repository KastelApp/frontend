import HomeLayout from "@/layouts/HomeLayout.tsx";
import onEnter from "@/utils/onEnter.ts";
import safePromise from "@/utils/safePromise.ts";
import { useClientStore, useTokenStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import { Button, Card, Input, Link } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import Logger from "@/utils/Logger.ts";
import arrayify from "@/utils/arrayify.ts";
import { Routes } from "@/utils/Routes.ts";

const Reset = () => {
	const router = useRouter();

	const { t } = useTranslationStore();
	const { client } = useClientStore();
	const { setToken } = useTokenStore();

	const [requestId, token] = arrayify(router.query?.slug);

	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(false);

	const [error, setError] = useState("");

	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");

	const validateToken = async () => {
		const [validated, error] = await safePromise(
			client.api.post<{
				id: string;
				token: string;
			}>({
				url: "/auth/reset",
				data: {
					id: requestId!,
					token: token!,
				},
				noAuth: true,
				noVersion: true,
			}),
		);

		if (!validated || error) {
			router.push(Routes.login());

			return;
		}

		if (validated.status !== 204) {
			router.push(Routes.login());

			return;
		}

		setReady(true);
	};

	const onReset = async () => {
		if (!password || password.length < 4) {
			setPasswordError(t("reset.newPassword.error"));

			return;
		}

		if (!confirmPassword) {
			setConfirmPasswordError(t("reset.confirm.error"));

			return;
		}

		if (password !== confirmPassword) {
			setConfirmPasswordError(t("reset.confirm.error"));

			return;
		}

		setLoading(true);

		const [reset, error] = await safePromise(
			client.api.patch<
				{
					id: string;
					token: string;
					password: string;
				},
				{
					token: string;
					userId: string;
				}
			>({
				url: "/auth/reset",
				data: {
					id: requestId!,
					token: token!,
					password,
				},
				noAuth: true,
				noVersion: true,
			}),
		);

		if (!reset || error) {
			setError(t("reset.error"));

			setLoading(false);

			return;
		}

		if (reset.status !== 200) {
			setError(t("reset.error"));

			setLoading(false);

			return;
		}

		setToken(reset.body.token);

		router.push(Routes.app());
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);

		if (!value || value.length < 4) {
			setPasswordError(t("reset.newPassword.error"));

			return;
		}

		setPasswordError("");
	};

	const handleConfirmPasswordChange = (value: string) => {
		setConfirmPassword(value);

		if (!value) {
			setConfirmPasswordError(t("reset.confirm.error"));

			return;
		}

		if (value !== password) {
			setConfirmPasswordError(t("reset.confirm.error"));

			return;
		}

		setConfirmPasswordError("");
	};

	useEffect(() => {
		if (!router.isReady) return;

		if (!requestId || !token) {
			router.push(Routes.login());

			return;
		}

		validateToken();
	}, [router]);

	return (
		<>
			<HomeLayout>
				<div className="flex items-center justify-center">
					<Card className="mt-32 flex w-full max-w-md items-center justify-center bg-lightAccent p-8 dark:bg-darkAccent">
						{ready ? (
							<div className="w-full max-w-md">
								<div className="text-center">
									<h1 className="text-3xl font-bold">{t("reset.title")}</h1>
									<p className="mt-4 text-medium">{t("reset.subtitle")}</p>
								</div>
								<div className="text-error-500 pb-0 pl-4 pt-3 text-center text-sm text-danger">{error || "\u00A0"}</div>
								<form className="mt-4">
									<div className="flex flex-col items-center space-y-4">
										<Input
											label={t("reset.newPassword.label")}
											variant="bordered"
											placeholder={t("reset.newPassword.placeholder")}
											endContent={
												<button
													className="focus:outline-none"
													type="button"
													onClick={() => setPasswordVisible((p) => !p)}
													tabIndex={-1}
												>
													{passwordVisible ? (
														<EyeIcon className="pointer-events-none text-2xl text-default-400" />
													) : (
														<EyeOffIcon className="pointer-events-none text-2xl text-default-400" />
													)}
												</button>
											}
											type={passwordVisible ? "text" : "password"}
											className="max-w-xs"
											description={t("reset.newPassword.description")}
											onValueChange={handlePasswordChange}
											value={password}
											isRequired
											errorMessage={passwordError || t("reset.newPassword.error")}
											minLength={4}
											maxLength={72}
											isInvalid={!!passwordError}
											tabIndex={2}
										/>
										<Input
											label={t("reset.confirm.label")}
											variant="bordered"
											placeholder={t("reset.confirm.placeholder")}
											endContent={
												<button
													className="focus:outline-none"
													type="button"
													onClick={() => setConfirmPasswordVisible((p) => !p)}
													tabIndex={-1}
												>
													{confirmPasswordVisible ? (
														<EyeIcon className="pointer-events-none text-2xl text-default-400" />
													) : (
														<EyeOffIcon className="pointer-events-none text-2xl text-default-400" />
													)}
												</button>
											}
											type={confirmPasswordVisible ? "text" : "password"}
											className="max-w-xs"
											description={t("reset.confirm.description")}
											onValueChange={handleConfirmPasswordChange}
											value={confirmPassword}
											isRequired
											errorMessage={confirmPasswordError || t("reset.confirm.error")}
											minLength={4}
											maxLength={72}
											isInvalid={!!confirmPasswordError}
											onKeyUp={onEnter(onReset)}
											tabIndex={2}
										/>
									</div>
									<div className="mt-8">
										<Button onClick={onReset} size="md" color="primary" variant="flat" className="w-full" tabIndex={3}>
											{loading ? <LoaderCircle className="custom-animate-spin text-white" /> : t("reset.button")}
										</Button>
									</div>
									<div className="mt-4 flex justify-between">
										<Link
											href={Routes.login()}
											color="primary"
											className="text-sm"
											as={NextLink}
											tabIndex={4}
											onClick={async () => {
												const [, err] = await safePromise(
													client.api.del<{
														id: string;
														token: string;
													}>({
														url: "/auth/reset",
														data: {
															id: requestId!,
															token: token!,
														},
														noVersion: true,
														noAuth: true,
													}),
												);

												if (err) {
													Logger.error("Failed to delete reset token", "Reset | delete token");
												}
											}}
										>
											{t("reset.remembered")}
										</Link>
									</div>
								</form>
							</div>
						) : (
							<LoaderCircle size={72} className="custom-animate-spin text-primary" />
						)}
					</Card>
				</div>
			</HomeLayout>
		</>
	);
};

export default Reset;
