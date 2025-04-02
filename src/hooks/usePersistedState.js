import {useState} from "react";

export default function usePersistedState(stateKey, initialState) {
    const [state, setState] = useState(() => {
        const persistedState = localStorage.getItem(stateKey);
        if (!persistedState) {
            return initialState;
        }

        if (persistedState === 'undefined') return {};

        return JSON.parse(persistedState);
    });

    const setPersistedState = (input) => {
        const persistedData = JSON.stringify(input);

        localStorage.setItem(stateKey, persistedData);

        setState(input);
    };

    return [
        state,
        setPersistedState,
    ]
}
