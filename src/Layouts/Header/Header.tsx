import React from "react";
import "./Header.scss";
import { User } from "../../App";

export interface HeaderProps {
    isAuthenticated: boolean;
    user: User;
}

export class Header extends React.Component<HeaderProps, any> {
    render() {
        return (
            <header className="Header">
                <div className="Header__Logo">
                    Logo
                </div>
                <div className="Header__Menu">
                    <div className="Header__Menu__Item Header__Menu__Item--pricing">
                        Pricing
                    </div>
                    <div className="Header__Menu__Item Header__Menu__Item--about">
                        About
                    </div>
                    <div className="Header__Menu__Item Header__Menu__Item--account">
                        <img src="" alt="" />
                        <p>{this.props.user.email}</p>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
