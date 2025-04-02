import {useEffect} from "react";
import {addBodyClass, removeBodyClass} from "@utils/helpers.js";
import Header from "@components/header/Header.jsx";
import Footer from "@components/footer/Footer.jsx";
import {Alert} from "react-bootstrap";
import {useAlert} from "@contexts/AlertContext.jsx";
import {Outlet} from "react-router";


export default function AdminPanelPage() {
    const {alert, setAlert} = useAlert();

    useEffect(() => {
        addBodyClass("layout-fixed");
        addBodyClass("sidebar-expand-lg");
        addBodyClass("bg-body-tertiary");

        return () => {
            removeBodyClass("layout-fixed");
            removeBodyClass("sidebar-expand-lg");
            removeBodyClass("bg-body-tertiary");
        };
    }, []);

    return (
        <div className="app-wrapper w-100">
            <Header/>

            {/* Main application template */}
            <main className="app-main">
                <div className="app-content-header">
                    {/* Header or breadcrumb placeholder, if needed */}
                </div>

                <div className="app-content">
                    <div className="container-fluid">
                        {alert && alert.text && alert.variant && (
                            <Alert variant={alert.variant} onClose={() => setAlert({})} dismissible>
                                {alert.text}
                            </Alert>
                        )}
                        <Outlet />
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}