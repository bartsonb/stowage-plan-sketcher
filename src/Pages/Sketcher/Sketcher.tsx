import React from "react";
import Toolbar from "../../Components/Toolbar/Toolbar";
import InfoPanel from "../../Components/InfoPanel/InfoPanel";
import MenuBar from "../../Components/MenuBar/MenuBar";
import Ship from "../../Components/Ship/Ship";
import Cargo from "../../Components/Cargo/Cargo";
import EditPanel from "../../Components/EditPanel/EditPanel";
import Defuser from "../../Components/Defuser/Defuser";
import CreationPanel from "../../Components/CreationPanel/CreationPanel";
import "./Sketcher.scss";

export interface Sketcher {
    canvasRef: any;
    ctx: any;
}

export type cargo = {
    coords: {
        x: number,
        y: number
    };
    deckIndex: number;
    cargoIndex: number;
    cargoType: string;
    selected: boolean;
    hazardous: boolean;
}

export interface SketcherProps {}

export class Sketcher extends React.Component<SketcherProps, any> {
    constructor(props: SketcherProps) {
        super(props);

        this.state = {
            ship: {
                name: null,
                decks: [],
                cargo: []
            },
            tool: "select",
            canvasOptions: { gridSize: 20, gridColor: '#222' },
            windowDimensions: { width: null, height: null },    
            timestampLastSave: null,
            changesMade: true
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
        window.addEventListener("keypress", this.handleKeyPress);
        // window.onbeforeunload = () => 'Leave page? You still have unsaved progress.';
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.handleResize);
        window.addEventListener("keypress", this.handleKeyPress);
    }

    // Updating the selected tool in state
    // and recovering the selected tool from localStorage
    private updateTool = (tool) => {
        this.setState({
            tool: tool,
        });

        localStorage.setItem("tool", tool);
    };

    // Handeling key presses to check if a shortcut button for a tool was clicked.
    private handleKeyPress = ({ key }: any): void => {
        const keyToTool = {
            'v': 'select', 
            'b': 'box', 
            'c': 'container'
        }

        this.updateTool(keyToTool[key]);
    }

    // Handeling the clicks on the ship and cargo elements
    // Event is needed to stop the eventPropagation
    // cargoIndex is used to indentify the clicked cargo element
    private handleClick = (event: any, cargoIndex: number | null, coords?: object, deckIndex?: number): void => {
        const { tool } = this.state;
        event.stopPropagation();

        // Select the cargo with the given index
        // (Deselecting by clicking again was removed - caused problems during mouseUp 
        // event during moving of cargo)
        if (tool === 'select' && cargoIndex !== null) {
            this.setState(prevState => {
                prevState.ship.cargo[cargoIndex].selected = true;

                return {
                    ship: { ...this.state.ship, cargo: [ ...prevState.ship.cargo ] }
                }
            });
        } 

        // Deselect all cargo, if background is clicked while any selection is active.
        if (tool === 'select' && cargoIndex == null) {
            this.deselectCargo();
        }

        // Create new cargo if click was registered on the background and has deck coords.
        if ((tool === 'container' || tool === 'box') && coords !== undefined) {
            // Set new cargoIndexes
            const newCargoState = this.state.ship.cargo.map((el, index) => {
                el.cargoIndex = index;
                return el;
            });

            this.setState(prevState => {
                return {
                    ship: {
                        ...prevState.ship,
                        cargo: [...newCargoState, { 
                            cargoType: tool, 
                            cargoIndex: this.state.ship.cargo.length,
                            deckIndex: deckIndex, 
                            coords, 
                            selected: false,
                            hazardous: false
                        }],
                    }
                }
            });
        }
    };

    // Sorting the selected cargo by their x or y coordiantes.
    // After sorting fhe first element will have the smallest coordiante.
    public alignCargo = (direction: string): void => {
        let axisToAlign = (direction === 'top' || direction === 'bottom')
            ? 'y'
            : 'x';
        let value = null;

        // Get smallest/highest coordinate from selected cargo
        this.state.ship.cargo.filter(el => el.selected).forEach(el => {
            if (value === null) {
                value = el.coords[axisToAlign];
            } else {
                // top and left alignment need the SMALLEST point
                // bottom and right alignment need the HIGHTEST point 
                if (direction === 'top' || direction === 'left') {
                    value = (value > el.coords[axisToAlign]) ? el.coords[axisToAlign] : value;
                } else {
                    value = (value < el.coords[axisToAlign]) ? el.coords[axisToAlign] : value;
                }
            }
        });

        // Set all selected cargos with the smallest coordiante
        this.state.ship.cargo.forEach(el => {
            if (el.selected) { el.coords[axisToAlign] = value; }
        });

        this.setState({
            ship: { ...this.state.ship, cargo: [...this.state.ship.cargo ] }
        });
    }

    // Get the coords of the selection box (top-left and bottom-right) and determine which cargo gets selected.
    // deckIndex needs to be given to identify the correct deck.
    public getSelectionBoxCoords = ({ x: x1, y: y1 }, { x: x2, y: y2 }, deckIndex: number): void => {
        const newCargoState = this.state.ship.cargo.map(el => {
            if (el.deckIndex === deckIndex) {
                if (el.coords.x > x1 && el.coords.x < x2 && el.coords.y > y1 && el.coords.y < y2) {
                    el.selected = true;
                    return el;
                } else {
                    return el;
                }
            } else {
                return el;
            }
        });

        this.setState({
            ship: { ...this.state.ship, cargo: [ ...newCargoState ]}
        });
    }

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

    // x1,y1 are the coords before and x2,y2 after the mouse movement.
    // The difference in direction gets applied to every cargo.
    private moveCargo = (x1: number, y1: number, x2: number, y2: number): void => {
        let differenceX = x2 - x1;
        let differenceY = y2 - y1;

        const newCargoState = this.state.ship.cargo.map(el => {
            if (el.selected) {
                el.coords.x = el.coords.x + differenceX;
                el.coords.y = el.coords.y + differenceY;
                return el;
            }

            return el;
        });

        this.setState(prevState => {
            return {
                ship: {
                    ...prevState.ship,
                    cargo: [ ...newCargoState ]
                }
            }
        })
    }

    private deleteCargo = (): void => {
        this.setState({
            ship: { ...this.state.ship, cargo: [ ...this.state.ship.cargo.filter(el => !el.selected) ] }
        })
    };

    private deselectCargo = (): void => {
        this.setState(prevState => {
            const allCargoDeselected = prevState.ship.cargo.map(el => {
                el.selected = false;
                return el;
            })

            return {
                ship: {  ...prevState.ship, cargo: [ ...allCargoDeselected ] }
            }
        });
    }

    // Edit cargo with given index
    private editCargo = (cargoIndex: number, key: string, value: any): void => {
        this.setState(prevState => {
            const newCargoState = prevState.ship.cargo.map(el => {
                if (el.cargoIndex === cargoIndex) { el[key] = value; }

                return el;
            })

            return {
                ship: { ...prevState.ship, cargo: [ ...newCargoState ] }
            }
        })
    }

    // Create a new ship object, after starting a new sketch.
    private createShip = (shipName: string, decks: object): void => {
        this.setState({
            ship: { name: shipName, decks: decks, cargo: [] }
        })
    }

    // Toggle visible decks.
    private toggleDecks = (deckIndex: number, visible: boolean): void => {
        this.setState(prevState => {
            const newDeckState = prevState.ship.decks.map((el, index) => {
                if (index === deckIndex) {
                    el.visible = !visible;
                    return el;
                }

                return el;
            })

            return {
                ship: { ...prevState.ship, decks: [ ...newDeckState ] }
            }
        })
    }

    public render() {
        // Return all visible Ship elements.
        let shipElements;

        if (this.state.ship.name !== null) {
            const { ship, tool } = this.state;

            shipElements = ship.decks.map((deck, deckIndex) => {
                // Get all cargo elements for the current deck
                const cargoElements = this.state.ship.cargo
                    .filter(cargo => cargo.deckIndex === deckIndex)
                    .map(cargo => {
                        return (
                            <Cargo 
                                key={cargo.cargoIndex} 
                                handleClick={this.handleClick}
                                index={cargo.cargoIndex} 
                                selected={cargo.selected} 
                                hazardous={cargo.hazardous}
                                preview={false}
                                coords={cargo.coords} 
                                type={cargo.cargoType} />
                        );
                    });

                return (
                    <Ship 
                        key={deckIndex}
                        deckIndex={deckIndex}
                        width={deck.width}
                        height={deck.height}
                        visible={deck.visible}
                        tool={tool}
                        name={ship.name}
                        deckName={deck.name}
                        handleClick={this.handleClick}
                        moveCargo={this.moveCargo}
                        getSelectionBoxCoords={this.getSelectionBoxCoords}>
                        
                        {cargoElements}
                    </Ship>
                )
            })
        }

        return (
            <div className="Sketcher">
                <MenuBar changesMade={this.state.changesMade} timestampLastSave={this.state.timestampLastSave} />
                <div className="Sketcher__Window">
                    <Toolbar
                        selectedTool={this.state.tool}
                        updateTool={this.updateTool}
                    />

                    <InfoPanel
                        decks={this.state.ship.decks}
                        cargo={this.state.ship.cargo}
                        toggleDecks={this.toggleDecks}
                    />

                    <EditPanel 
                        editCargo={this.editCargo}
                        deleteCargo={this.deleteCargo}
                        alignCargo={this.alignCargo}
                        cargo={this.state.ship.cargo} />

                    <Defuser show={this.state.ship.name === null}>
                        <CreationPanel 
                            createShip={this.createShip}
                            show={this.state.ship.name === null} />
                    </Defuser>

                    {shipElements}

                    <canvas ref={this.canvasRef} />
                </div>
            </div>
        );
    }
}

export default Sketcher;
