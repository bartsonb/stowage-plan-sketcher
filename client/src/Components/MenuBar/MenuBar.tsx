import "./MenuBar.scss";

import createIcon from "../../Assets/Icons/create.svg";
import saveIcon from "../../Assets/Icons/save.svg";
import exportIcon from "../../Assets/Icons/export.svg";

export interface MenuBarProps {
    sketchLoaded: any;
    savedTimestamp: number;
    saved: boolean;
    showCreationPanel: boolean;
    showLoadingPanel: boolean;
    togglePanel(name: string): void;
}

export const MenuBar = (props: MenuBarProps) => {
    const { savedTimestamp, saved, sketchLoaded, togglePanel, showCreationPanel, showLoadingPanel } = props;

    return (
        <div className="MenuBar">
            <div
                onClick={() => {
                    togglePanel("create");
                }}
                className={`MenuBar__Button MenuBar__Button--create${showCreationPanel ? " MenuBar__Button--active" : ""}`}
            >
                <img src={createIcon} alt="" />
                Create new
            </div>

            <div
                onClick={() => {
                    togglePanel("load");
                }}
                className={`MenuBar__Button MenuBar__Button--load${showLoadingPanel ? " MenuBar__Button--active" : ""}`}
            >
                <img src={createIcon} alt="" />
                Load exisiting
            </div>

            <div
                style={{ display: sketchLoaded ? "flex" : "none" }}
                className="MenuBar__Button MenuBar__Button--save"
            >
                <img src={saveIcon} alt="" />
                Save
                <span>(Saved last {savedTimestamp}s ago)</span>
            </div>

            <div
                style={{ display: sketchLoaded ? "flex" : "none" }}
                className="MenuBar__Button MenuBar__Button--export"
            >
                <img src={exportIcon} alt="" />
                Export
            </div>
        </div>
    );
};

export default MenuBar;
