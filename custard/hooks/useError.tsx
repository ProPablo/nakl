import { ErrorContext } from "@/components/GlobalErrorProvider";
import { useContext } from "react";

export function useError() {
    const setError = useContext(ErrorContext);
    return setError;
}