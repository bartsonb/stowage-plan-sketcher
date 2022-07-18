import { useState, useEffect } from "react";
import Box from "../Box/Box";
import "./InfoPanel.scss";

export interface InfoPanelProps {
    decks?: any;
    cargo?: any;
    toggleDecks: any;
    selectedDeck: number;
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

    const abbreviations = {
        'container': 'cn',
        'box': 'bx'
    }

    // Return the list of cargo
    let cargoList = [];
    if (props.cargo) { 
        cargoList = cargo.map(el => {
            return <p className="InfoPanel__Cargo__Element">{`${el.cargoIndex}.${abbreviations[el.cargoType]}`}</p>
        }) 
    }

    // Return the buttons that are used to switch the deck view
    let deckSwitchButtons = props.decks.map((el, index) => {
        return (
            <button 
                key={index}
                onClick={() => {props.toggleDecks(index)}}
                className={props.selectedDeck === index ? 'InfoPanel__Buttons__Button--active' : ''}>
                    Deck {index + 1}
            </button>
        )
    })

    return (
        <Box cssClass="InfoPanel" title="Info Panel">
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
            <p className="InfoPanel__Cargo" style={{ display: `${isCollapsed ? "none" : "flex"}` }}>
                {cargoList}
            </p>
        </Box>
    );
};

export default InfoPanel;
