const UserTag = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="ml-1 max-h-4 min-h-4 max-w-16 rounded-md bg-primary/60 pl-1.5 pr-1.5 text-xs font-extrabold uppercase">
			{children}
		</div>
	);
};

export default UserTag;
