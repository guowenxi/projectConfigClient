import React from "react";
import {RouteConfigComponentProps, renderRoutes} from "react-router-config";
import {ConfigProvider} from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";

const Layout: React.FC<RouteConfigComponentProps> = React.memo(function box(props) {
    // const history = useHistory()
    const {route} = props;
    // console.log(" layout", props);
    return <ConfigProvider locale={zhCN}>{renderRoutes(route?.routes)}</ConfigProvider>;
});

export const MainLayout: React.FC<RouteConfigComponentProps> = React.memo(function box(props) {
    // const history = useHistory()
    const {route} = props;
    // console.log("basic layout");
    return (
        <div className="basic-layout flex-row">
            <div className="left" style={{flex: "0 0 240px"}}>
                left
            </div>
            <div className="Fill right-container">{renderRoutes(route?.routes)}</div>
        </div>
    );
});

export default Layout;

