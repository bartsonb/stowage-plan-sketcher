import React from "react";
import Toolbar from "../../Components/Toolbar/Toolbar";
import InfoPanel from "../../Components/InfoPanel/InfoPanel";
import MenuBar from "../../Components/MenuBar/MenuBar";
import Ship from "../../Components/Ship/Ship";
import Cargo from "../../Components/Cargo/Cargo";
import EditPanel from "../../Components/EditPanel/EditPanel";
import "./Sketcher.scss";

export interface Sketcher {
    canvasRef: any;
    ctx: any;
}

export interface cargo {
    coords: {
        x: number,
        y: number
    };
    deckIndex: number;
    cargoIndex: number;
    cargoType: string;
    selected: boolean;
}

export interface SketcherProps {}

export class Sketcher extends React.Component<SketcherProps, any> {
    constructor(props: SketcherProps) {
        super(props);

        this.state = {
            decks: [{ width: '300px', height: '450px' }],
            cargo: [],
            tool: "select",
            mode: "new",
            selectedDeck: 0,
            canvasOptions: { gridSize: 15, strokeColor: '#333', gridColor: '#c8c8c8' },
            windowDimensions: { width: null, height: null },     
        }

        this.canvasRef = React.createRef();
        this.ctx = null;
    }

    componentDidMount(): void {
        this.setState({
            tool: localStorage.getItem("tool"),
        });

        // Get context via canvas ref
        this.ctx = this.canvasRef.current.getContext("2d");
        this.handleResize();

        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.handleResize);
    }

    // Updating the selected tool in state
    // and recovering the selected tool from localStorage
    private updateTool = (tool) => {
        this.setState({
            tool: tool,
        });

        localStorage.setItem("tool", tool);
    };

    // Handeling the clicks on the ship and cargo elements
    // Event is needed to stop the eventPropagation
    // cargoIndex is used to indentify the click cargo element
    private handleClick = (event: any, cargoIndex: number | null, coords?: object): void => {
        const { tool } = this.state;
        event.stopPropagation();

        // De-/select the cargo with the given index
        if (tool === 'select' && cargoIndex !== null) {
            this.state.cargo[cargoIndex].selected = !this.state.cargo[cargoIndex].selected;

            this.setState({
                cargo: [ ...this.state.cargo ]
            });
        } 

        // Deselect all cargo, if background is clicked while any selection is active
        if (tool === 'select'  && cargoIndex == null) {
            this.deselectCargo();
        }

        // Create new cargo
        if (tool === 'container' || tool === 'box') {
            this.setState({
                cargo: [...this.state.cargo, { 
                    cargoType: tool, 
                    cargoIndex: this.state.cargo.length,
                    deckIndex: this.state.selectedDeck, 
                    coords, 
                    selected: false 
                }]
            });
        }
    };

    // Sorting the selected cargo by their x or y coordiantes.
    // The first element will have the smallest point.
    public alignCargo = (direction: string): void => {
        const axisToAlign = (direction === 'horizontal') ? 'y' : 'x';
        let smallestPoint = null;

        // Get smallest coordinate
        this.getSelectedCargo().forEach(el => {
            if (smallestPoint === null) {
                smallestPoint = el.coords[axisToAlign];
            } else {
                smallestPoint = (smallestPoint > el.coords[axisToAlign]) ? el.coords[axisToAlign] : smallestPoint;
            }
        });

        // Set all selected cargos with the smallest coordiante
        this.state.cargo.map(el => {
            if (el.selected) { el.coords[axisToAlign] = smallestPoint; }
        });

        this.setState({
            cargo: [...this.state.cargo ]
        });
    }

    // Return only the cargo elements that have been selected.
    public getSelectedCargo = (): cargo[] => this.state.cargo.filter(el => el.selected);

    // Get height and width of the current browser window.
    public getWindowDimensions = (): any => {
        return { width: window.innerWidth, height: window.innerHeight };
    };

    // TODO redraw canvas elements on resize
    // Update windowDimensions and adjust the canvas size + grid accordingly.
    // Canvas render size is doubled to get a higher resolution image.
    private handleResize = () => {
        this.setState({ windowDimensions: this.getWindowDimensions() }, () => {
            this.canvasRef.current.width = this.state.windowDimensions.width * 2;
            this.canvasRef.current.height = this.state.windowDimensions.height * 2;

            this.drawGrid();
        });
    };

    // Draw background grid depending on the given gridSize.
    private drawGrid = (): void => {
        const { width, height } = this.state.windowDimensions;
        this.ctx.beginPath();

        for (var x = 0; x <= width * 2; x += this.state.canvasOptions.gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height * 2);
        }

        for (var y = 0; y <= height * 2; y += this.state.canvasOptions.gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width * 2, y);
        }

        this.ctx.strokeStyle = this.state.canvasOptions.gridColor;
        this.ctx.stroke();
        this.ctx.closePath();
    };

    private deleteCargo = (): void => {
        this.setState({
            cargo: [ ...this.state.cargo.filter(el => !el.selected) ]
        })
    };

    private deselectCargo = (): void => {
        const allCargoDeselected = this.state.cargo.map(el => {
            el.selected = false;
            return el;
        })

        this.setState({
            cargo: [ ...allCargoDeselected ]
        });
    }

    public render() {
        const cargoElements = this.state.cargo.map(el => {
            return (
                <Cargo 
                    key={el.cargoIndex} 
                    handleClick={this.handleClick}
                    index={el.cargoIndex} 
                    selected={el.selected} 
                    preview={false}
                    coords={el.coords} 
                    type={el.cargoType} />
            );
        });

        return (
            <div className="Sketcher">
                <MenuBar />
                <div className="Sketcher__Window">
                    <Toolbar
                        selectedTool={this.state.tool}
                        updateTool={this.updateTool}
                    />

                    <InfoPanel
                        decks={this.state.decks}
                        cargo={this.state.cargo}
                    />

                    <EditPanel 
                        deselectCargo={this.deselectCargo}
                        deleteCargo={this.deleteCargo}
                        alignCargo={this.alignCargo}
                        cargo={this.state.cargo} />

                    <Ship 
                        tool={this.state.tool}
                        name={'Nautica'}
                        decks={[{ width: '350px', height: '500px' }]}
                        handleClick={this.handleClick}>
                        
                        {cargoElements}
                    </Ship>

                    <canvas ref={this.canvasRef} />
                </div>
            </div>
        );
    }
}

export default Sketcher;
