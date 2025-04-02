import {useEffect, useState} from "react";
import {addBodyClass, removeBodyClass} from "@utils/helpers.js";
import Header from "@components/header/Header.jsx";
import Footer from "@components/footer/Footer.jsx";
import Sidebar from "@components/sidebar/sidebar.jsx";
import {Alert} from "react-bootstrap";
import {useAlert} from "@contexts/AlertContext.jsx";
import {Outlet} from "react-router";


export default function AdminPanelPage({children}) {
    let [sidebarIsShown, setsSidebarIsShown] = useState(true);
    const {alert, setAlert} = useAlert();

    const toggleSidebar = () => {
        setsSidebarIsShown((prevState) => {
            if (prevState) {
                addBodyClass("sidebar-collapse");
            } else {
                removeBodyClass("sidebar-collapse");
            }
            return !prevState;
        });
    };

    useEffect(() => {
        addBodyClass("layout-fixed");
        addBodyClass("sidebar-expand-lg");
        addBodyClass("bg-body-tertiary");
        addBodyClass("sidebar-open");

        return () => {
            removeBodyClass("layout-fixed");
            removeBodyClass("sidebar-expand-lg");
            removeBodyClass("bg-body-tertiary");
            removeBodyClass("sidebar-open");
            removeBodyClass("sidebar-collapse");
        };
    }, []);

    return (
        <div className="app-wrapper w-100">
            <Header toggleSidebar={toggleSidebar}/>

            <Sidebar/>

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