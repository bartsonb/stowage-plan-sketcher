import Box from "../Box/Box";
import axios from "axios";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { cargo } from "../Cargo/Cargo";
import "./LoadingPanel.scss";

export interface LoadingPanelProps {
    togglePanel(name: string): void;
    deleteSketch(uuid: string): void;
    overwriteSketch(
        shipName: string,
        shipDestination: string,
        decks: object[],
        cargo: cargo[],
        uuid?: string
    ): void;
}

export const LoadingPanel = (props: LoadingPanelProps) => {
    const [loading, setLoading] = useState(false);
    const [sketches, setSketches] = useState([]);
    const { togglePanel, overwriteSketch } = props;

    const handleLoad = ({ shipName, shipDestination, decks, cargo, uuid }): void => {
        overwriteSketch(shipName, shipDestination, decks, cargo, uuid);
        togglePanel("LoadingPanel");
    };

    const handleDelete = (uuid: string): void => {
        props.deleteSketch(uuid);
        togglePanel("LoadingPanel");
    }

    const getSketchElements = () => {
        return sketches.map((el, index) => (
            <div key={index} className="SketchElement">
                <div className="SketchElement__Name">
                    <p>{el.shipName}</p>
                </div>
                <div className="SketchElement__Destination">
                    <p>Destination: <span>{el.shipDestination}</span></p>
                </div>
                <div className="SketchElement__Decks">
                    {el.decks.map((deck, index) => (
                        <p key={index}>Deck "{deck.name}":{" "}<span>{" "}({deck.height} x {deck.width})</span></p>
                    ))}
                </div>
                <div className="SketchElement__Buttons">
                        <button className="SketchElement__Buttons SketchElement__Buttons--load" onClick={() => {handleLoad(el)}}>Load</button>
                        <button className="SketchElement__Buttons SketchElement__Buttons--delete" onClick={() => {handleDelete(el.uuid)}}>Delete</button>
                </div>
            </div>
        ));
    };

    useEffect(() => {
        loadSketches();
    }, []);

    const loadSketches = (): void => {
        setLoading(true);

        axios({
            method: "get",
            url: "/api/sketches",
        })
            .then((res) => {
                setSketches(res.data.sketches);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    if (loading) {
        return (
            <Box cssClass="LoadingPanel" title="Load sketch">
                <div className="LoadingPanel__Spinner">
                    <SyncLoader size={8} color="#ccc" />
                </div>
            </Box>
        );
    } else {
        return (
            <Box cssClass="LoadingPanel" title="Load sketch">
                <div className="LoadingPanel__Category">Your sketches</div>
                <div className="LoadingPanel__Content">{getSketchElements()}</div>
            </Box>
        );
    }
};

export default LoadingPanel;
