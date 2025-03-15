import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from "./App.jsx";
import {BrowserRouter} from "react-router";


createRoot(document.body).render(
    <BrowserRouter>
        <StrictMode>
            <App/>
        </StrictMode>
    </BrowserRouter>
);
