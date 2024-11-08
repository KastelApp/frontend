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
    const updateRef = useRef<number | null>(null);
  
    const updateFormattedDate = () => {
      setFormattedDate(formatDate(date, format));
      updateRef.current = requestAnimationFrame(updateFormattedDate);
    };
  
    useEffect(() => {
      updateRef.current = requestAnimationFrame(updateFormattedDate);

      return () => {
        if (updateRef.current !== null) cancelAnimationFrame(updateRef.current);
      };
    }, [date, format]);
  
    return <>{formattedDate}</>;
}

export default LiveDate;