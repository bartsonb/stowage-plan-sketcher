import "./MenuBar.scss";

import createIcon from '../../Assets/Icons/create.svg';
import saveIcon from '../../Assets/Icons/save.svg';
import exportIcon from '../../Assets/Icons/export.svg';

export interface MenuBarProps {
    timestampLastSave: number;
    changesMade: boolean;
}

export const MenuBar = (props: MenuBarProps) => {
    const { timestampLastSave, changesMade } = props;

    return (
        <div className="MenuBar">
            <div className="MenuBar__Button MenuBar__Button--create">
                <img src={createIcon} alt="" />
                Create new sketch
            </div>
            <div className="MenuBar__Button MenuBar__Button--save">
                <img src={saveIcon} alt="" />
                Save sketch<span>(Saved last {timestampLastSave}s ago)</span>
            </div>
            <div className="MenuBar__Button MenuBar__Button--export">
                <img src={exportIcon} alt="" />
                Export sketch
            </div>
        </div>
    );
};

export default MenuBar;
