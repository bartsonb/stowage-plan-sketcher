import React, { Children } from "react";
import Header from "../Header/Header";
import { User } from "../../App";

export interface MainLayoutProps {
    children: any;
    isAutheticated: boolean;
    user: User;
}

export class MainLayout extends React.Component<MainLayoutProps, any> {

    render() {
        return (
            <div>
                <Header isAuthenticated={this.props.isAutheticated} user={this.props.user} />
                {this.props.children}
            </div>
        )
    }
}

export default MainLayout;