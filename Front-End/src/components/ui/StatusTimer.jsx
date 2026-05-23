import { useEffect, useState } from "react";

export default function StatusTimer({ startedAt, className = "" }) {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
        if (!startedAt) return;

        const tick = () => {
            const now     = new Date();
            const start   = new Date(startedAt);
            const diff    = Math.floor((now - start) / 1000);
            const hours   = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            setElapsed(
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
        };

        tick(); // run immediately
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    if (!startedAt) return null;

    return (
        <span className={`font-mono text-xs ${className}`}>
            {elapsed}
        </span>
    );
}