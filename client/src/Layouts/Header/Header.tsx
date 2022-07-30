import React from "react";
import "./Header.scss";
import { User } from "../../App";
import { Link } from "react-router-dom";

export interface HeaderProps {
    isAuthenticated?: Boolean;
    user?: User;
}

export class Header extends React.Component<HeaderProps, any> {
    render() {
        let userDependentMenuItems = [];

        if (this.props.isAuthenticated) {
            userDependentMenuItems.push(
                <div key={1} className="Header__Menu__Item Header__Menu__Item--account">
                    <img src="" alt="" />
                    <p>{this.props.user.email}</p>
                </div>
            );
        } else {
            userDependentMenuItems.push([
                <div key={0} className="Header__Menu__Item Header__Menu__Item--register">
                    <Link to={'/register'}>Register</Link>
                </div>,
                <div key={1} className="Header__Menu__Item Header__Menu__Item--login">
                    <Link to={'/login'}>Login</Link>
                </div>,
            ]);
        }

        return (
            <header className="Header">
                <div className="Header__Logo">
                    Stowage Plan Sketcher
                    <span>v1.0</span>
                </div>
                <div className="Header__Menu">
                    <div className="Header__Menu__Item Header__Menu__Item--pricing">
                        Our Team
                    </div>
                    <div className="Header__Menu__Item Header__Menu__Item--about">
                        About
                    </div>
                    {userDependentMenuItems}
                </div>
            </header>
        );
    }
}

export default Header;
