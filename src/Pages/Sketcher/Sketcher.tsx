import React, { useRef } from "react";
import MainLayout from "../../Layouts/MainLayout/MainLayout";
import Toolbar from "../../Components/Toolbar/Toolbar";
import InfoPanel from "../../Components/InfoPanel/InfoPanel";
import MenuBar from "../../Components/MenuBar/MenuBar";
import Canvas from "../../Components/Canvas/Canvas";
import './Sketcher.scss';

export interface SketcherProps {

}

export class Sketcher extends React.Component<SketcherProps, any> {
    public state = {
        decks: [], 
        cargo: [],
        tool: 'select',
        mode: 'new'
    }

    componentDidMount(): void {
        this.setState({
            tool: localStorage.getItem('tool')
        })
    }

    private updateTool = (tool) => {
        this.setState({
            tool: tool
        })

        localStorage.setItem('tool', tool);
    }

    private addCargo = (cargoType: string, deckIndex: number, position: object): void => {
        this.setState({ cargo: [{ cargoType, deckIndex, position }, ...this.state.cargo] })
    }

    private removeCargo = (cargoIndex: number): void => {
        this.setState({ cargo: this.state.cargo.splice(cargoIndex, 1) });
    }

    public render() {

        return (
            <MainLayout>
                <div className="Sketcher">
                    <MenuBar />
                    <div className="Sketcher__Window">

                        <Toolbar 
                            selectedTool={this.state.tool} 
                            updateTool={this.updateTool} />

                        <InfoPanel 
                            decks={this.state.decks} 
                            cargo={this.state.cargo} />

                        <Canvas 
                            addCargo={this.addCargo}
                            removeCargo={this.removeCargo}
                            selectedTool={this.state.tool} 
                            gridSize={20} />

                    </div>
                </div>
            </MainLayout>
        )
    }
}

export default Sketcher;