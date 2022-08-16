import React from "react";
import Header from "../../Components/Header/Header";
import { User } from "../../App";
import "./MainLayout.scss";

export interface MainLayoutProps {
    children?: any;
    isAutheticated?: Boolean;
    logoutUser: any;
    user?: User;
    className?: string;
}

export const MainLayout = (props: MainLayoutProps) => {
    return (
        <main className={`Main${props.className ? ' Main__' + props.className : ''}`}>
            <Header
                logoutUser={props.logoutUser}
                isAuthenticated={props.isAutheticated}
                user={props.user}
            />
            {props.children}
        </main>
    );
}

export default MainLayout;
