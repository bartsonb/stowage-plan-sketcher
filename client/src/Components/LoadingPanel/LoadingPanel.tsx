import Box from "../Box/Box";
import "./LoadingPanel.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import reloadIcon from "../../Assets/Icons/reload.svg";

export interface LoadingPanelProps {
    togglePanel(name: string): void;
    updateSketch(
        shipName: string,
        shipDestination: string,
        decks: object,
        uuid?: string
    ): void;
}

export const LoadingPanel = (props: LoadingPanelProps) => {
    const [loading, setLoading] = useState(false);
    const [sketches, setSketches] = useState([]);
    const { togglePanel, updateSketch } = props;

    const handleClick = ({ shipName, shipDestination, decks, uuid }) => {
        updateSketch(shipName, shipDestination, decks, uuid );
        togglePanel("LoadingPanel")
    }

    const getSketchElements = () => {
        return sketches.map((el, index) => (
            <div key={index} onClick={() => {handleClick(el)}}className="LoadingPanel__Content__SketchElement">
                <div className="LoadingPanel__Content__SketchElement__Name">
                    <p><span>[{index}]</span> {el.shipName}</p> 
                </div>
                <div className="LoadingPanel__Content__SketchElement__Destination">
                    <p>Destination: <span>{el.shipDestination}</span></p>
                </div>
                <div className="LoadingPanel__Content__SketchElement__Decks">
                    {el.decks.map((deck, index) => <p key={index}>Deck "{deck.name}": <span> ({deck.height} x {deck.width})</span></p>)}
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
            url: "http://localhost:5000/api/sketches",
        })
            .then((res) => {
                setSketches(res.data.sketches);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };
    
    return (
        <Box cssClass="LoadingPanel" title="Load sketch">
            {loading ? (
                <div className="LoadingPanel__Spinner"><SyncLoader size={8} color="#ccc" /></div>
            ) : (
                <div className="LoadingPanel__Content">
                    <div className="LoadingPanel__Content__Category">Options</div>
                    <button
                        className={`LoadingPanel__Content__Reload${
                            loading ? " LoadingPanel__Content__Reload--loading" : ""
                        }`}
                        onClick={loadSketches}
                    >
                        <img src={reloadIcon} />
                    </button>

                    <div className="LoadingPanel__Content__Category">
                        All sketches
                    </div>
                    {getSketchElements()}
                </div>
            )}
        </Box>
    );
};

export default LoadingPanel;
