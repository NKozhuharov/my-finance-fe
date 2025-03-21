import {createContext, useContext} from 'react';

export const AlertContext = createContext({
    alert: {},
    setAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);
