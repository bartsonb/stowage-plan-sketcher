import React, { Children } from "react";

import { Header } from "../Header/Header";

export interface MainLayoutProps {
    children: any;
}

export class MainLayout extends React.Component<MainLayoutProps, any> {
    render() {
        return (
            <div>
                <Header />
                {this.props.children}
            </div>
        )
    }
}