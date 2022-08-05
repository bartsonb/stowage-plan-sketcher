import Box from "../Box/Box";
import "./LoadingPanel.scss";
import axios from "axios";
import { useState } from "react";

export interface LoadingPanelProps {
    show: boolean;
    togglePanel(name: string): void;
    updateSketch(
        shipName: string,
        shipDestination: string,
        decks: object
    ): void;
}

export const LoadingPanel = (props: LoadingPanelProps) => {
    const [ loading, setLoading ] = useState(false);

    const { show } = props;

    const loadSketches = (): void => {
        setLoading(true);
        
        axios({
            method: "get",
            url: "http://localhost:5000/api/sketches",
        })
            .then((res) => {
                console.log(res);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    if (show) {
        return (
            <Box cssClass="LoadingPanel" title="Load sketch">
                <button onClick={loadSketches}>Load</button>
            </Box>
        );
    }
};

export default LoadingPanel;
