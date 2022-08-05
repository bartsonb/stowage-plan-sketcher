import Box from '../Box/Box';
import './LoadingPanel.scss';

export interface LoadingPanelProps {
    show: boolean;
    loadSketch(shipName: string, shipDestination: string, decks: object): void;
    togglePanel(name: string): void;
}

export const LoadingPanel = (props: LoadingPanelProps) => {
    const {  show, loadSketch } = props;

    if (show) {
        return (
            <Box cssClass="LoadingPanel" title="Load sketch">
                
            </Box>
        )
    }
}

export default LoadingPanel;