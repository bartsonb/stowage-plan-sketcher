import { useState, useEffect } from "react";
import "./InfoPanel.scss";

export interface InfoPanelProps {
    decks?: object;
    cargo?: any;
}

export const InfoPanel = (props: InfoPanelProps) => {
    const { decks, cargo } = props;
    const [isCollapsed, setIsCollapsed] = useState(null);

    const handleClick = (e): void => {
        setIsCollapsed(!isCollapsed);
        localStorage.setItem(
            "infoPanelIsCollapsed",
            JSON.stringify(!isCollapsed)
        );
    };

    useEffect(() => {
        setIsCollapsed(
            JSON.parse(localStorage.getItem("infoPanelIsCollapsed") || "false")
        );

        return () => {};
    });

    let cargoList = [];
    if (props.cargo) { cargoList = cargo.map(el => `${el.cargoType}, `) }

    return (
        <div className="InfoPanel">
            <p onClick={handleClick}>collapse</p>
            <p>InfoPanel: I am {`${isCollapsed ? "closed" : "open"}`}.</p>
            <hr />
            <p style={{ display: `${isCollapsed ? "none" : "inline-block"}` }}>
                {cargoList}
            </p>
        </div>
    );
};

export default InfoPanel;
