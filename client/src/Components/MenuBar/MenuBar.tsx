import React from "react";
import editIcon from "../../Assets/Icons/edit.svg";
import loadIcon from "../../Assets/Icons/load.svg";
import saveIcon from "../../Assets/Icons/save.svg";
import exportIcon from "../../Assets/Icons/export.svg";
import { useEffect, useState } from "react";
import "./MenuBar.scss";

export interface MenuBarProps {
    sketchLoaded: any;
    savedTimestamp: Date;
    showCreationPanel: boolean;
    showLoadingPanel: boolean;
    togglePanel(name: string): void;
    saveSketch(): void;
    exportSketch(): void;
}

export const MenuBar = (props: MenuBarProps) => {
    const { 
        savedTimestamp, sketchLoaded, togglePanel, saveSketch, exportSketch, 
        showCreationPanel, showLoadingPanel,
    } = props;

    const [ timeSinceSaved, setTimeSinceSaved ] = useState("");
    const timerRef = React.useRef(null);

    const calculateTimeSinceSaved = () => {
        // getTime() returns time in miliseconds
        const secondsPassed = Math.round((new Date().getTime() - savedTimestamp.getTime()) / 1000);
        let timeScale = "s";
        let timeAdjustedToScale = secondsPassed;
        
        if (secondsPassed > 59) { 
            timeScale = "m";
            timeAdjustedToScale = secondsPassed / 60;
        }
        else if (secondsPassed > 3600) { 
            timeScale = "h";
            timeAdjustedToScale = secondsPassed / 3600;
        }
        else if (secondsPassed > 86399) { 
            timeScale = "d";
            timeAdjustedToScale = secondsPassed / 86400;
        }

        setTimeSinceSaved(Math.round(timeAdjustedToScale) + timeScale);
    }

    useEffect(() => {
        if (savedTimestamp) {
            timerRef.current = setInterval(calculateTimeSinceSaved, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [savedTimestamp]);

    return (
        <div className="MenuBar">
            <div
                onClick={() => {
                    togglePanel("CreationPanel");
                }}
                className={`MenuBar__Button MenuBar__Button--create${showCreationPanel ? " MenuBar__Button--active" : ""}`}
            >
                <img src={editIcon} alt="" />
                Create & Edit
            </div>

            <div
                onClick={() => {
                    togglePanel("LoadingPanel");
                }}
                className={`MenuBar__Button MenuBar__Button--load${showLoadingPanel ? " MenuBar__Button--active" : ""}`}
            >
                <img src={loadIcon} alt="" />
                Load
            </div>

            <div
                style={{ display: sketchLoaded ? "flex" : "none" }}
                className="MenuBar__Button MenuBar__Button--save"
                onClick={saveSketch}
            >
                <img src={saveIcon} alt="" />
                Save
                <span>(Saved last {timeSinceSaved} ago)</span>
            </div>

            <div
                style={{ display: sketchLoaded ? "flex" : "none" }}
                className="MenuBar__Button MenuBar__Button--export"
                onClick={exportSketch}
            >
                <img src={exportIcon} alt="" />
                Export
            </div>
        </div>
    );
};

export default MenuBar;
