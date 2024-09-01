const Logo = ({
	bgColor = "#000",
	size = 512,
	mainColor = "#8c52ff",
	faceColor = "#fff",
}: {
	bgColor?: string;
	size?: number;
	mainColor?: string;
	faceColor?: string;
}) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 512 512"
			xmlSpace="preserve"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				backgroundColor: bgColor,
			}}
		>
			<path
				style={{
					fill: mainColor,
					fillOpacity: 1,
					strokeWidth: 0.95232,
				}}
				d="M126 124h261v262H126z"
			/>
			<ellipse
				style={{
					fill: mainColor,
					fillOpacity: 1,
					strokeWidth: 0.251006,
				}}
				cx={351.5}
				cy={150}
				rx={72.5}
				ry={73}
			/>
			<circle
				style={{
					fill: faceColor,
					fillOpacity: 1,
					strokeWidth: 0.304379,
				}}
				cx={322.263}
				cy={188.532}
				r={45.482}
			/>
			<ellipse
				style={{
					fill: mainColor,
					fillOpacity: 1,
					strokeWidth: 0.251006,
				}}
				cx={351.5}
				cy={348}
				rx={72.5}
				ry={73}
			/>
			<ellipse
				style={{
					fill: mainColor,
					fillOpacity: 1,
					strokeWidth: 0.251006,
				}}
				cx={159.5}
				cy={348}
				rx={72.5}
				ry={73}
			/>
			<ellipse
				style={{
					fill: mainColor,
					fillOpacity: 1,
					strokeWidth: 0.251006,
				}}
				cx={159.5}
				cy={150}
				rx={72.5}
				ry={73}
			/>
			<circle
				style={{
					fill: faceColor,
					fillOpacity: 1,
					strokeWidth: 0.304379,
				}}
				cx={188.319}
				cy={187.589}
				r={45.482}
			/>
			<path
				style={{
					fill: faceColor,
					fillOpacity: 1,
					strokeWidth: 0.271409,
				}}
				d="M307.745 346.84c-18.695 11.783-43.625 17.923-65.616 13.956-15.442-2.785-31.26-8.258-43.018-16.706-8.036-5.774-14.387-13.19-19.706-19.15-9.743-10.918-14.596-25.18-13.156-35.193 1.874-13.031 14.18-21.16 26.034-21.482 3.15-.085 11.397 1.127 16.806 5.239 6.936 5.274 8.91 15.395 16.283 22.786 8.013 8.031 20.148 12.617 28.421 13.63 11.96 1.463 24.69-4.05 34.717-14.537 4.261-4.457 6.516-11.362 9.978-16.167 4.368-6.062 9.77-9.66 13.663-10.592 11.74-2.812 30.51 3.943 33.408 18.945 3.21 16.618-11.283 42.55-37.814 59.271"
			/>
		</svg>
	);
};

export default Logo;
