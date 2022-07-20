import React from "react";
import './AuthLayout.scss';

export interface AuthLayoutProps {
    children: any;
    title: string;
}

export class AuthLayout extends React.Component<AuthLayoutProps, any> {
    render() {
        return (
            <div className={`AuthLayout ${this.props.title}`}>
                <h1>{this.props.title}</h1>
                {this.props.children}
            </div>
        )
    }
}

export default AuthLayout;