import './NavBar.scss';

export interface NavBarProps {

}

export const NavBar = (props: NavBarProps) => {
    return (
        <div className="NavBar">
            <h1>Logo</h1>
            <h1>Navbar</h1>
        </div>
    )
}

export default NavBar;