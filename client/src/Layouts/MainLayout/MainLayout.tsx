import React from "react";
import Header from "../Header/Header";
import { User } from "../../App";
import "./MainLayout.scss";

export interface MainLayoutProps {
    children?: any;
    isAutheticated?: boolean;
    user?: User;
}

export class MainLayout extends React.Component<MainLayoutProps, any> {
    render() {
        return (
            <main className="Main">
                <Header
                    isAuthenticated={this.props.isAutheticated}
                    user={this.props.user}
                />
                {this.props.children}
            </main>
        );
    }
}

export default MainLayout;
