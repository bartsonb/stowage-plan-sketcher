import "./Header.scss";
import { User } from "../../App";
import { Link } from "react-router-dom";

export interface HeaderProps {
    isAuthenticated?: Boolean;
    user?: User;
    logoutUser: any;
}

export const Header = (props: HeaderProps) => {
    let userDependentMenuItems = [];

    if (props.isAuthenticated) {
        const usenameFirstLetter = props.user.name[0].toUpperCase();
        
        userDependentMenuItems.push(
            <div key={0} className="Header__Menu__Item Header__Menu__Item--account">
                <div>{usenameFirstLetter}</div>
                <p>{props.user.name} <span>({props.user.email})</span></p>
            </div>,
            <div key={1} className="Header__Menu__Item Header__Menu__Item--logout">
                <a onClick={props.logoutUser} href="#">Logout</a>
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
                <Link to={"/"} replace={true}>
                    Stowage Plan Sketcher
                </Link>
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

export default Header;
