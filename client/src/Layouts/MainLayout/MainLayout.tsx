import React from "react";
import Header from "../Header/Header";
import { User } from "../../App";
import "./MainLayout.scss";

export interface MainLayoutProps {
    children?: any;
    isAutheticated?: Boolean;
    user?: User;
    className?: String;
}

export class MainLayout extends React.Component<MainLayoutProps, any> {
    render() {
        return (
            <main className={`Main${this.props.className ? ' Main__' + this.props.className : ''}`}>
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
