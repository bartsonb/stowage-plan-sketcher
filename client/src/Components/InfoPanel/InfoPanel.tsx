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

    // Return information about decks
    let stats = decks.map((deck, index) => {

        return <div className="deckStats" key={index}>
            <div className="deckStats__Category">{deck.name}</div>
            <p><span>Amount of cargo: </span> {cargo.filter(cargo => cargo.deckIndex === deck.index).length}</p>
            <p><span>Hazardous: </span> {cargo.filter(cargo => (cargo.deckIndex === deck.index) && cargo.hazardous).length}</p>
        </div>;
    }); 

    // Return the buttons that are used to switch the deck view,
    // hightlighting the currently visible decks.
    let deckSwitchButtons = props.decks.map((el, index) => {
        return (
            <button 
                key={index}
                onClick={() => {props.toggleDecks(index, el.visible)}}
                className={el.visible ? 'active' : ''}>
                    Deck {index + 1}
            </button>
        )
    })

    return (
        <Box cssClass="InfoPanel" title="Info Panel" sizing={{ position: "absolute", top: 40, right: 40 }}>
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

            <div className="InfoPanel__Cargo">
                {stats}
            </div>
        </Box>
    );
};

export default InfoPanel;
