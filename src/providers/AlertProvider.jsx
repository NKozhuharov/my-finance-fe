import {useCallback, useState} from "react";
import {AlertContext} from "../contexts/AlertContext.jsx";

export const AlertProvider = ({children}) => {
    const [alert, setAlertState] = useState({}); // State to hold alert data

    // Function to set the alert with auto-clearing after a timeout
    const setAlert = useCallback((newAlert, timeout = 3000) => {
        setAlertState(newAlert);

        // Automatically clear the alert after the timeout period
        setTimeout(() => {
            setAlertState(null);
        }, timeout);
    }, []);

    return (
        <AlertContext.Provider value={{alert, setAlert}}>
            {children}
        </AlertContext.Provider>
    );
};
