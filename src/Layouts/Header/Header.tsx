import React from "react";
import './Header.scss';
import NavBar from "../../Components/NavBar/NavBar";

export interface HeaderProps {

}

export class Header extends React.Component<HeaderProps, any> {
    render() {
        return (
            <header className="Header">
                <NavBar />
                <div className="AccountBar">
                    <h1>User Account</h1> 
                </div>
            </header>
        )
    }
}

export default Header;