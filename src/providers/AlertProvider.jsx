import {useState} from "react";
import {AlertContext} from "../contexts/AlertContext.jsx";

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({}); // State to hold alert data
console.log("Current Alert State:", alert);

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
