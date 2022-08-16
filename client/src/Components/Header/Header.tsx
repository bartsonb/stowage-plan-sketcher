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
            <div key={0} className="Header__Item_Account">
                <div className="Header__ProfilePicture">{usenameFirstLetter}</div>
                <p>{props.user.name} <span>({props.user.email})</span></p>
                <div className="Header__Indicator"></div>
                <div className="Header__Dropdown">
                    <ul>
                        <li><a href="#">User settings</a></li>
                        <li  onClick={props.logoutUser}><a href="#">Logout</a></li>
                    </ul>
                </div>
            </div>
        );
    } else {
        userDependentMenuItems.push([
            <div key={0} className="Header__Item">
                <Link to={'/register'}>Register</Link>
            </div>,
            <div key={1} className="Header__Item">
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
                <div className="Header__Item">
                    Our Team
                </div>
                <div className="Header__Item">
                    About
                </div>
                {userDependentMenuItems}
            </div>
        </header>
    );
}

export default Header;
