import AllBadges from "@/badges/AllBadges.tsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Badges = () => {
    const [size, setSize] = useState(24);
    const router = useRouter();

    useEffect(() => {
        const size = router.query.size;

        if (typeof size === "string") {
            setSize(parseInt(size));
        }
    }, [router])

    return (
        <>
        <AllBadges privateFlags="999999999999999" publicFlags="9999999999999999999999" size={size} />
        </>
    )
}

export default Badges