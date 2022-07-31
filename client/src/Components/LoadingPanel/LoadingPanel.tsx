import Box from '../Box/Box';
import './LoadingPanel.scss';

export interface LoadingPanelProps {
    show: boolean;
    loadSketch(shipName: string, decks: object): void;
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