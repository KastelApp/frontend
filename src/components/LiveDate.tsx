import { DateFormat, formatDate } from "@/utils/formatDate.ts";
import { useEffect, useRef, useState } from "react";

interface LiveDateProps {
    date: Date;
    format?: DateFormat
}

const LiveDate = ({
    date,
    format = "relative"
}: LiveDateProps) => {
    const [formattedDate, setFormattedDate] = useState(() => formatDate(date, format));
    const updateRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
        const diff = Date.now() - date.getTime();
        const timeout = diff < 60 * 1000 ? 1000 : 10 * 1000;

        const updateFormattedDate = () => {
            setFormattedDate(formatDate(date, format));
            updateRef.current = setTimeout(updateFormattedDate, timeout);
        };

        updateFormattedDate();

        return () => {
            if (updateRef.current !== null) clearTimeout(updateRef.current);
        };
    }, [date, format]);
  
    return <>{formattedDate}</>;
}

export default LiveDate;