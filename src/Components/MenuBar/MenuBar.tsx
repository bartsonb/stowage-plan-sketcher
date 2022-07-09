import './MenuBar.scss';

export interface MenuBarProps {
  
}

export const MenuBar = (props: MenuBarProps) => {

  return (
    <div className="MenuBar">
      <p>File</p>
      <p>Edit</p>
      <p>About</p>
    </div>
  );
}

export default MenuBar;