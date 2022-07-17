import "./MenuBar.scss";

export interface MenuBarProps {
    timestampLastSave: number;
    changesMade: boolean
}

export const MenuBar = (props: MenuBarProps) => {
    const { timestampLastSave, changesMade } = props;
    
    return (
        <div className="MenuBar">
            <div className="MenuBar__Button MenuBar__Button--create">Create new sketch</div>
            <div className="MenuBar__Button MenuBar__Button--save">Save project<span>(Saved last {timestampLastSave}s ago)</span></div>
        </div>
    );
};

export default MenuBar;
