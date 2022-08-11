import React from "react";
import Toolbar, { isCargoTool, isSelectTool } from "../Toolbar/Toolbar";
import InfoPanel from "../InfoPanel/InfoPanel";
import MenuBar from "../MenuBar/MenuBar";
import Ship, { deck } from "../Ship/Ship";
import Cargo, { cargo } from "../Cargo/Cargo";
import EditPanel from "../EditPanel/EditPanel";
import Diffuser from "../Diffuser/Diffuser";
import LoadingPanel from "../LoadingPanel/LoadingPanel";
import CreationPanel from "../CreationPanel/CreationPanel";
import axios from "axios";
import { User } from "../../App";
import { MoonLoader } from "react-spinners";
import { toPng } from 'html-to-image';
import { saveAs } from "file-saver";
import "./Sketcher.scss";

export interface SketcherProps {
    user: User;
}

export interface SketcherState {
    uuid: string,
    shipName: string,
    shipDestination: string,
    decks: any[],
    cargo: cargo[],
    tool: string,
    savedTimestamp: number,
    saved: boolean,
    showCreationPanel: boolean,
    showLoadingPanel: boolean,
    loading: boolean,
}

export class Sketcher extends React.Component<SketcherProps, SketcherState> {
    constructor(props: SketcherProps) {
        super(props);

        this.state = {
            uuid: null,
            shipName: null,
            shipDestination: null,
            decks: [],
            cargo: [],
            tool: "select",
            savedTimestamp: null,
            saved: false,
            showCreationPanel: false,
            showLoadingPanel: false,
            loading: false
        }
    }

    componentDidMount(): void {
        window.addEventListener("keypress", this.handleKeyPress);
        // window.onbeforeunload = () => 'Leave page? You still have unsaved progress.';
    }

    componentWillUnmount(): void {
        // Remove unneccessary event listeners
        window.addEventListener("keypress", this.handleKeyPress);
    }

    // Updating the selected tool in state
    // and recovering the selected tool from localStorage
    private updateTool = (tool) => {
        this.setState({
            tool: tool,
        });
    };

    // Used to toggle Creation and Loading panels
    private togglePanel = (name: string): void => {
        switch (name) {
            case "CreationPanel":
                return this.setState({ showCreationPanel: !this.state.showCreationPanel });
            case "LoadingPanel":
                return this.setState({ showLoadingPanel: !this.state.showLoadingPanel });
        }
    }

    // Handeling key presses to check if a shortcut button for a tool was clicked.
    private handleKeyPress = ({ key }: any): void => {
        const keyToTool = {
            'v': 'select', 
            'b': 'box', 
            'c': 'container'
        }

        // Only update tool if the pressed key exists in the keyToTool object
        if (Object.keys(keyToTool).includes(key)) {
            this.updateTool(keyToTool[key]);
        }
    }

    // Handeling the clicks on the ship and cargo elements
    // Event is needed to stop the eventPropagation
    // cargoIndex is used to indentify the clicked cargo element
    private handleCargoClick = (event: any, cargoIndex: number | null, coords?: any, deckIndex?: number): void => {
        const { tool } = this.state;
        event.stopPropagation();

        // Select the cargo with the given index
        // (Deselecting by clicking again was removed - caused problems during mouseUp 
        // event during moving of cargo)
        if (isSelectTool(tool) && cargoIndex !== null) {
            this.setState(prevState => {
                const newCargoState = prevState.cargo.map(el => ({
                    ...el,
                    selected: el.selected ? true : false
                }));

                return { cargo: newCargoState }
            });
        } 

        // Deselect all cargo, if background is clicked while any selection is active.
        if (isSelectTool(tool) && cargoIndex === null) {
            this.deselectCargo();
        }

        // Create new cargo if click was registered on the background and has deck coords.
        if (isCargoTool(tool) && coords !== undefined) {
            this.setState((prevState) => {
                const newCargoState = prevState.cargo.map((el, index) => ({
                    ...el,
                    cargoIndex: index
                }));

                return {
                    cargo: [...newCargoState, { 
                        cargoType: tool, 
                        cargoIndex: prevState.cargo.length,
                        deckIndex: deckIndex, 
                        coords: {
                            x: coords.x,
                            y: coords.y
                        }, 
                        selected: false,
                        hazardous: false
                    }]
                }
            });
        }
    };

    // TODO deck und cargo click handler trennen
    private handleDeckClick = this.handleCargoClick;

    // Sorting the selected cargo by their x or y coordiantes.
    // After sorting fhe first element will have the smallest coordiante.
    public alignCargo = (direction: string): void => {
        let axisToAlign = (direction === 'top' || direction === 'bottom')
            ? 'y'
            : 'x';
        let value = null;

        this.setState(prevState => {
            // Get smallest/highest coordinate from selected cargo
            prevState.cargo.filter(el => el.selected).forEach(el => {
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
            const newCargoState = prevState.cargo.map(el => ({
                ...el,
                coords: {
                    ...el.coords, 
                    [axisToAlign]: value
                }
            }));

            return { cargo: newCargoState }
        });
    }

    // Get the coords of the selection box (top-left and bottom-right) and determine which cargo gets selected.
    // deckIndex needs to be given to identify the correct deck.
    public getSelectionBoxCoords = ({ x: x1, y: y1 }, { x: x2, y: y2 }, deckIndex: number): void => {
        this.setState(prevState => {
            const newCargoState = prevState.cargo.map(el => {
                const insideOfSelection = el.coords.x > x1 && el.coords.x < x2 && el.coords.y > y1 && el.coords.y < y2;

                return {
                    ...el, 
                    selected: (el.deckIndex === deckIndex && insideOfSelection) ? true : false
                }
            });

            return { cargo: newCargoState }
        });
    }

    // x, y are the relative movements from the last mouse position
    // The difference in direction gets applied to every cargo.
    // TODO fix weird behaviour
    private moveCargo = (x: number, y: number): void => {
        this.setState(prevState => {
            const newCargoState = prevState.cargo.map(el => ({
                ...el,
                coords: {
                    x: (el.selected) ? el.coords.x + x : el.coords.x,
                    y: (el.selected) ? el.coords.y + y : el.coords.y
                }
            }));

            return { cargo: newCargoState }
        });
    }

    private deleteCargo = (): void => {
        this.setState(prevState => {
            const newCargoState = prevState.cargo
                .filter(el => !el.selected)
                .map((el, index) => ({
                    ...el,
                    cargoIndex: index
                }));

            return { cargo: newCargoState };
        })
    };

    private deselectCargo = (): void => {
        this.setState(prevState => {
            const newCargoState = prevState.cargo.map(el => ({
                ...el,
                selected: false
            }));

            return { cargo: newCargoState }
        });
    }

    // Edit cargo with given index
    private editCargo = (cargoIndex: number, key: string, value: any): void => {
        this.setState(prevState => {
            const newCargoState = prevState.cargo.map(el => ({
                ...el,
                [key]: (el.cargoIndex === cargoIndex) ? value : el[key] 
            }));

            return { cargo: newCargoState }
        })
    }

    // Used during mounting of decks to save ref in sketcher state.
    private setDeckRef = (deckIndex: number, ref: any) => {
        this.setState(prevState => {
            const newDeckState = prevState.decks.map(el => ({
                ...el,
                ref: (el.index === deckIndex) ? ref : el.ref
            }));

            return ({ decks: newDeckState });
        })
    }

    // Update or create sketch, also checks for cargo with not associated deck.
    private updateSketch = (shipName: string, shipDestination: string, decks: deck[], uuid: string): void => {
        this.setState(prevState => {
            // Get array of all deck indices.
            const deckIndicices = decks.map(el => el.index);

            // Remove cargo that has no associated deck.
            const cargo = prevState.cargo.filter(el => deckIndicices.includes(el.deckIndex));

            return { uuid, shipName, shipDestination, decks, cargo }
        })
    }

    // Complete overwrite of current sketch. 
    // Used when loading in already created sketches.
    private overwriteSketch = (shipName: string, shipDestination: string, decks: object[], cargo: cargo[], uuid: string): void => {
        this.setState(() => {
            // Need to clear decks state, so react creates new deck components from scratch.
            // Important, because deckRefs are created onMount. 
            return { decks: [] };
        }, () => {
            this.setState({ uuid, shipName, shipDestination, decks, cargo });
        });
    }

    // Helper function to strip unnecessary keys from state before sending state to API.
    private removeKeysFromObject = (obj: any, arr: string[]): any => {
        const object = Object.assign({}, obj);

        for (let key in object) {
            if (arr.includes(key)) delete object[key];
        }

        return object;
    }

    private saveSketch = (): void => {
        this.setState({ loading: true });

        // Remove unnecessary keys from state.
        let data = this.removeKeysFromObject(this.state, ['saved', 'savedTimestamp', 'showCreationPanel', 'showLoadingPanel', 'tool']);
        
        // Remove refs from decks. Caused problems because of circular structure. 
        data.decks = data.decks.map(el => ({ ...el, ref: null }));

        axios({
            method: 'post', 
            url: '/api/sketches',
            data
        })
            .then(res =>  {
                this.setState({ savedTimestamp: res.data.sketch.updatedAt })
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => this.setState({ loading: false }))
    }

    private exportSketch = async () => {
        this.setState({ loading: true });

        // Loop through all decks and generate Base64-encoded images
        // of their deck+cargos based on their ref.
        
        const dataUrls = await Promise.all(this.state.decks.map(async el => {
            const dataUrl = await toPng(el.ref);

            return { index: el.index, dataUrl };
        }));

        axios({
            method: "post", 
            url: `/api/sketches/${this.state.uuid}/export`, 
            responseType: 'blob',
            data: { dataUrls }
        })
            .then(res =>  {
                saveAs(new File(
                    [res.data], 
                    res.headers['x-filename'], 
                    { type: res.headers['content-type'] + ';charset=utf-8' }
                ));
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            })
    }

    // Toggle visibility of decks.
    private toggleDecks = (deckIndex: number, visible: boolean): void => {
        this.setState(prevState => {
            const newDeckState = prevState.decks.map((el, index) => ({
                ...el,
                visible: (index === deckIndex) ? !el.visible : el.visible
            }));

            return { decks: newDeckState }
        })
    }

    public render() {
        const { 
            uuid, saved, savedTimestamp, shipName, shipDestination, cargo, 
            decks, tool, showCreationPanel, showLoadingPanel, loading
        } = this.state;
        
        let shipElements;

        if (decks.length > 0) {
            shipElements = decks.map(deck => {
                // Get all cargo elements for the current deck
                const cargoElements = cargo
                    .filter(cargo => cargo.deckIndex === deck.index)
                    .map(cargo => {
                        return (
                            <Cargo 
                                key={cargo.cargoIndex} 
                                handleClick={this.handleCargoClick}
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
                        key={deck.index}
                        deckIndex={deck.index}
                        width={deck.width}
                        height={deck.height}
                        visible={deck.visible}
                        tool={tool}
                        name={shipName}
                        deckName={deck.name}
                        handleClick={this.handleDeckClick}
                        moveCargo={this.moveCargo}
                        setDeckRef={this.setDeckRef}
                        getSelectionBoxCoords={this.getSelectionBoxCoords}>
                        
                        {cargoElements}
                    </Ship>
                )
            })
        }

        return (
            <div className="Sketcher">
                <MenuBar 
                    togglePanel={this.togglePanel}
                    showCreationPanel={showCreationPanel}
                    showLoadingPanel={showLoadingPanel}
                    saved={saved} 
                    savedTimestamp={savedTimestamp} 
                    sketchLoaded={decks.length > 0}
                    saveSketch={this.saveSketch}
                    exportSketch={this.exportSketch}
                    />

                <div className="Sketcher__Window">
                    <Toolbar
                        selectedTool={tool}
                        updateTool={this.updateTool}
                    />

                    <InfoPanel
                        decks={decks}
                        cargo={cargo}
                        toggleDecks={this.toggleDecks}
                    />

                    <EditPanel 
                        editCargo={this.editCargo}
                        deleteCargo={this.deleteCargo}
                        alignCargo={this.alignCargo}
                        cargo={cargo} />

                    <Diffuser show={showCreationPanel || showLoadingPanel || loading}>
                        {/* Unloading component to avoid prop-state conflict, after loading a new sketch. */}
                        { showCreationPanel && <CreationPanel
                            uuid={uuid}
                            shipName={shipName}
                            shipDestination={shipDestination}
                            decks={decks}
                            togglePanel={this.togglePanel}
                            updateSketch={this.updateSketch} />}

                        { showLoadingPanel && <LoadingPanel 
                            togglePanel={this.togglePanel}
                            overwriteSketch={this.overwriteSketch} /> }
                        <MoonLoader loading={loading} size={35} color={"#fff"} />
                    </Diffuser>

                    {shipElements}
                </div>
            </div>
        );
    }
}

export default Sketcher;