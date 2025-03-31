import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useEffect} from "react";

export default function Dashboard() {
    useEffect(() => {
        document.title = "MyFinance";
    });

    return (
        <AdminPanelPage>
            <div className="row">
                {/* Replace or modify the content as needed for this page */}
                <div className="col-lg-3 col-6">
                    <div className="small-box text-bg-primary">
                        <div className="inner">
                            <h3>150</h3>
                            <p>New Orders</p>
                        </div>
                        <a
                            href="#"
                            className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                        >
                            More info <i className="bi bi-link-45deg"></i>
                        </a>
                    </div>
                </div>
                <div className="col-lg-3 col-6">
                    <div className="small-box text-bg-success">
                        <div className="inner">
                            <h3>53%</h3>
                            <p>Bounce Rate</p>
                        </div>
                        <a
                            href="#"
                            className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                        >
                            More info <i className="bi bi-link-45deg"></i>
                        </a>
                    </div>
                </div>
                {/* Add more content as needed */}
            </div>
        </AdminPanelPage>
    );
}