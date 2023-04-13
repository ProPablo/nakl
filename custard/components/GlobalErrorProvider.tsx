import { ReactNode, FunctionComponent, memo, useEffect, useState, createContext } from 'react';

interface Props {
    children: ReactNode;
}

type ErrorContextValue = React.Dispatch<React.SetStateAction<string | null>>;
export const ErrorContext = createContext<ErrorContextValue>({} as ErrorContextValue);

const ERROR_TOAST_DELAY = 3000;

const GlobalErrorProvider: FunctionComponent<Props> = ({ children }) => {

    const [error, setError] = useState<string | null>(null);
    const [remainingError, setRemainingError] = useState("");

    // Handles error changing and going back to null after some time
    // https://github.com/craig1123/react-recipes/blob/master/src/useDebounce.js for inspiration
    useEffect(() => {
        if (error == null) return;
        setRemainingError(error);

        let timer = setTimeout(() => { setError(null) }, ERROR_TOAST_DELAY);

        return () => {
            clearTimeout(timer);
        }
    }, [error]);
    return (

        <ErrorContext.Provider value={setError}>
            {children}
            {/* toast for persistance through pages  */}
            <div className={`toast toast-start transition-opacity text-white ${!!error ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50`}>
                <div className="alert alert-error shadow-lg text-white">
                    <div>
                        <span>Error Encountered: {remainingError}</span>
                    </div>
                </div>
            </div>
        </ErrorContext.Provider >
    );
};

export default memo(GlobalErrorProvider);