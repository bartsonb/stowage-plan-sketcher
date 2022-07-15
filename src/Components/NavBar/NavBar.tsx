import './NavBar.scss';

export interface NavBarProps {

}

export const NavBar = (props: NavBarProps) => {
    return (
        <div className="NavBar">
            <h1 className='NavBar__Logo'>Logo</h1>
            <h1 className='NavBar__Menu'>Menu</h1>
        </div>
    )
}

export default NavBar;