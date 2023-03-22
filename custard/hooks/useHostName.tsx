import { useEffect, useState } from "react";

export function useHostName() {
    const [hostName, setHostName] = useState("");
    useEffect(() => {
        // console.log(window.location)
        setHostName(window.location.host)
    }, [])
    return hostName;
}