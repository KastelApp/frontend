import { useEffect } from "react";

const ErrorPage = () => {

    useEffect(() => {
        throw new Error("Testing Error");
    }, []);

    return (
        <div className="">
            hi :3
        </div>
    );
};

export default ErrorPage;