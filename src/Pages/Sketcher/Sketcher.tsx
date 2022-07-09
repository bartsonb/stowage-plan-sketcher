import React, { useRef } from "react";
import { MainLayout } from "../../Layouts/MainLayout/MainLayout";
import Toolbar from "../../Components/Toolbar/Toolbar";
import InfoPanel from "../../Components/InfoPanel/InfoPanel";
import MenuBar from "../../Components/MenuBar/MenuBar";
import Canvas from "../../Components/Canvas/Canvas";
import './Sketcher.scss';

export interface SketcherProps {

}

export class Sketcher extends React.Component<SketcherProps, any> {
    public state = {
        decks: null, 
        cargo: null,
        tool: 'select',
        mode: 'new'
    }

    componentDidMount(): void {
        this.setState({
            tool: localStorage.getItem('tool')
        })
    }

    public updateTool = (tool) => {
        this.setState({
            tool: tool
        })

        localStorage.setItem('tool', tool);
    }

    public render() {

        return (
            <MainLayout>
                <div className="Sketcher">
                    <MenuBar />
                    <div className="Sketcher__Window">
                        <Toolbar selectedTool={this.state.tool} updateTool={this.updateTool} />
                        <InfoPanel decks={this.state.decks} cargo={this.state.cargo} />
                        <Canvas divider={400} gridSize={20} />
                    </div>
                </div>
            </MainLayout>
        )
    }
}

export default Sketcher;