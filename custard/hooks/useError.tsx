import { ErrorContext } from "@/pages/_app";
import { useContext } from "react";

export function useError() {
    const setError = useContext(ErrorContext);
    return setError;
}