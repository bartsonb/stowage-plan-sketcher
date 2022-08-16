import { useState, useEffect } from "react";
import Box from "../Box/Box";
import { cargo, cargoInfo } from "../Cargo/Cargo";
import { deck } from "../Deck/Deck";
import "./InfoPanel.scss";

export interface InfoPanelProps {
    shipDestination?: string;
    shipName?: string;
    decks?: deck[];
    cargo?: cargo[];
    toggleDecks: any;
}

export const InfoPanel = (props: InfoPanelProps) => {
    const { decks, cargo, shipDestination, shipName, } = props;
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
    }, []);

    // Return the list of cargo
    let cargoList = [];
    if (props.cargo) { 
        cargoList = cargo.map((el, index) => {
            return (
                <p 
                    key={index}
                    className="InfoPanel__Cargo__Element">
                        {`${el.cargoIndex}.${cargoInfo[el.cargoType].abbreviation}${el.hazardous ? '(H)' : ''}`}
                </p>
            )
        }) 
    }

    // Return the buttons that are used to switch the deck view,
    // hightlighting the currently visible decks.
    let deckSwitchButtons = props.decks.map((el, index) => {
        return (
            <button 
                key={index}
                onClick={() => {props.toggleDecks(index, el.visible)}}
                className={el.visible ? 'InfoPanel__Buttons__Button--active' : ''}>
                    Deck {index + 1}
            </button>
        )
    })

    return (
        <Box cssClass="InfoPanel" title="Info Panel">
            <p className="InfoPanel__Category">Sketch</p>
            <div className="InfoPanel__Ship">
                {shipName && <p><span>Name</span>{shipName}</p>}
            </div>
            <div className="InfoPanel__Ship">
                {shipDestination && <p><span>Destination</span>{shipDestination}</p>}
            </div>

            <p className="InfoPanel__Category">Decktoggler</p>
            <div className="InfoPanel__Buttons">
                {deckSwitchButtons}
            </div>

            <p 
                className="InfoPanel__Category" 
                onClick={handleClick}>
                    Cargo Information 
                <span className={'InfoPanel__Category__Toggle ' + (isCollapsed ? 'InfoPanel__Category__Toggle--active' : '')}>&#9660;</span>
            </p>
            <div className="InfoPanel__Cargo" style={{ display: `${isCollapsed ? "none" : "flex"}` }}>
                {cargoList}
            </div>
        </Box>
    );
};

export default InfoPanel;
