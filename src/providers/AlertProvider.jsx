import {useState} from "react";
import {AlertContext} from "../contexts/AlertContext.jsx";

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({}); // State to hold alert data

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
