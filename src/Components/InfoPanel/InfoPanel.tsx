import { useState, useEffect } from "react";
import Box from "../Box/Box";
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
        <Box cssClass="InfoPanel" title="Info Panel">
            <p onClick={handleClick}>v</p>
            <p style={{ display: `${isCollapsed ? "none" : "inline-block"}` }}>
                {cargoList}
            </p>
        </Box>
    );
};

export default InfoPanel;
