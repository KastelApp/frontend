import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/app.css";
import "./styles/color.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const rootApp = createRoot(document.getElementById("root")!);

rootApp.render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
);
