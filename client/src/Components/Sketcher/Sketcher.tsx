import React from "react";
import Toolbar, { isSelectTool } from "../Toolbar/Toolbar";
import InfoPanel from "../InfoPanel/InfoPanel";
import MenuBar from "../MenuBar/MenuBar";
import Deck, { deck } from "../Deck/Deck";
import Cargo, { cargo, cargoInfo, cargoType } from "../Cargo/Cargo";
import EditPanel from "../EditPanel/EditPanel";
import Diffuser from "../Diffuser/Diffuser";
import LoadingPanel from "../LoadingPanel/LoadingPanel";
import CreationPanel from "../CreationPanel/CreationPanel";
import axios from "axios";
import { User } from "../../App";
import { MoonLoader } from "react-spinners";
import { toPng } from 'html-to-image';
import { saveAs } from "file-saver";
import Toasty, { ToasterTypes } from "../Toasty/Toasty";
import "./Sketcher.scss";

export interface SketcherProps {
    user: User;
}

export interface SketcherState {
    uuid: string,
    shipName: string,
    shipDestination: string,
    decks: deck[],
    cargo: cargo[],
    tool: string,
    savedTimestamp: Date,
    showCreationPanel: boolean,
    showLoadingPanel: boolean,
    loading: boolean,
}

export interface Sketcher {
    toastyRef: React.RefObject<Toasty | null>
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
            savedTimestamp: new Date(),
            showCreationPanel: false,
            showLoadingPanel: false,
            loading: false
        }

        this.toastyRef = React.createRef<Toasty>();
    }

    componentDidMount(): void {
        // Create wrapper function to make for cleaner code
        this.notify = this.toastyRef.current?.notify.bind({});

        window.addEventListener("keypress", this.handleKeyPress);
        window.onbeforeunload = () => 'Make sure that you have saved your progress.';
    }

    componentWillUnmount(): void {
        // Remove unneccessary event listeners
        window.addEventListener("keypress", this.handleKeyPress);
        window.onbeforeunload = null;
    }

    private notify;

    // Updating the given tool in state
    private updateTool = tool => this.setState({tool});

    // Used to toggle Creation and Loading panels
    private togglePanel = (name: string): void => {
        switch (name) {
            case "CreationPanel":
                return this.setState({ 
                    showCreationPanel: !this.state.showCreationPanel,
                    showLoadingPanel: false
                });
            case "LoadingPanel":
                return this.setState({ 
                    showLoadingPanel: !this.state.showLoadingPanel,
                    showCreationPanel: false
                });
        }
    }

    // Handeling key presses to check if a shortcut button for a tool was pressed
    private handleKeyPress = ({ ctrlKey, key }: any): void => {
        // Lookup object, key -> tool
        const keyToTool = { 'v': 'select'}

        // Add shortcut keys from cargoInfo definition in Cargo.tsx to
        // lookup object.
        for (const cargoType in cargoInfo) {
            keyToTool[cargoInfo[cargoType].hotkey] = cargoType;
        }

        // Only update tool if the pressed key exists in the keyToTool object
        if (Object.keys(keyToTool).includes(key)) this.updateTool(keyToTool[key]);
    }

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

            // Set all selected cargos with the smallest coordinate
            const newCargoState = prevState.cargo.map(el => ({
                ...el,
                coords: (el.selected) ? {
                    ...el.coords, 
                    [axisToAlign]: value
                } : el.coords
            }));

            return { cargo: newCargoState }
        });
    }

    // Get the start and end coords of selection box and determine which cargo gets selected.
    // deckIndex needs to be given to identify the correct deck.
    public selectMultipleCargo = ({ x: x1, y: y1 }, { x: x2, y: y2 }, deckIndex: number): void => {
        this.setState(prevState => {
            const newCargoState = prevState.cargo.map(el => {
                const { x: elX, y: elY } = el.coords;
                const insideOfSelection = (
                    // dragged left to right, then bottom or top
                    (elX > x1 && elX < x2 && (elY > y1 && elY < y2 || elY < y1 && elY > y2)) ||
                    // dragged right to left, then bottom or top
                    (elX < x1 && elX > x2 && (elY > y1 && elY < y2 || elY < y1 && elY > y2))  
                )

                return {
                    ...el, 
                    selected: (el.deckIndex === deckIndex && insideOfSelection) ? true : false
                }
            });

            return { cargo: newCargoState }
        });
    }

    // Select cargo with given index-.
    private selectCargo = (cargoIndex: number): void => {
        this.setState(prevState => {    
            const newCargoState = prevState.cargo.map(el => ({
                ...el, 
                selected: (el.cargoIndex === cargoIndex) ? true : false
            }));

            return { cargo: newCargoState }
        });
    }

    // Deselects ALL cargo.
    private deselectCargo = (): void => {
        this.setState(prevState => {
            return { cargo: prevState.cargo.map(el => ({
                ...el,
                selected: false
            }))}
        });
    }

    private getCargoInformation = (cargoIndex: number): cargo => {
        return this.state.cargo.filter(el => el.cargoIndex === cargoIndex)[0];
    }

    private addCargo = (coords: {x, y}, deckIndex: number, cargoType: string) => {
        this.setState((prevState) => {
            // Reassign new indices for all cargos.
            const newCargoState = prevState.cargo.map((el, index) => ({
                ...el,
                cargoIndex: index
            }));

            return {
                cargo: [...newCargoState, { 
                    cargoType, 
                    deckIndex, 
                    coords, 
                    cargoIndex: prevState.cargo.length,
                    selected: false,
                    hazardous: false
                }]
            }
        });
    }

    // x, y are the relative movements from the last mouse position
    // The difference in direction gets applied to every cargo.
    private moveCargo = (x: number, y: number): void => {
        // Todo theoretisches viereck für boundaries
        this.setState(prevState => {
            const newCargoState = prevState.cargo.map(el => ({
                ...el,
                coords: {
                    x: (el.selected && (el.coords.x + x) >= 0) ? el.coords.x + x : el.coords.x,
                    y: (el.selected && (el.coords.y + y) >= 0) ? el.coords.y + y : el.coords.y
                }
            }));

            return { cargo: newCargoState }
        });
    }

    // TODO only reassign cargo indexes of cargo on the current deck
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

            this.notify("Success!", `Created "${shipName}" with ${decks.length} decks.`, ToasterTypes.SUCCESS);
            return { uuid, shipName, shipDestination, decks, cargo }
        })
    }

    // Complete overwrite of current sketch. 
    // Used when loading in already created sketches.
    private overwriteSketch = (shipName: string, shipDestination: string, decks: deck[], cargo: cargo[], uuid: string): void => {
        this.setState(() => {
            // Need to clear decks state, so react creates new deck components from scratch.
            // Important, because deckRefs are created onMount. 
            return { decks: [] };
        }, () => {
            this.setState({ savedTimestamp: new Date(), uuid, shipName, shipDestination, decks, cargo });
            this.notify("Success!", `Loaded sketch "${shipName}".`, ToasterTypes.SUCCESS);
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
            .then(res => {
                this.setState({ savedTimestamp: new Date(res.data.sketch.updatedAt) });
                this.notify("Success!", `Saved sketch "${this.state.shipName}".`, ToasterTypes.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                this.notify("Error!", "Saving failed. Check the console for more information.", ToasterTypes.FAILURE);
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

                this.notify("Success!", `Saved sketch as "${res.headers['x-filename']}".`, ToasterTypes.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                this.notify("Error!", `Failed to export "${this.state.shipName}".`, ToasterTypes.FAILURE);
            })
            .finally(() => {
                this.setState({ loading: false });
            })
    }

    private deleteSketch = (uuid: string): void => {
        this.setState({ loading: true });

        axios({
            method: "delete", 
            url: `/api/sketches/${uuid}`
        })
            .then(res =>  {
                this.togglePanel("LoadingPanel");
                this.notify("Success!", `Sketch "${res.data.sketch.shipName}" deleted.`, ToasterTypes.SUCCESS);
            })
            .catch(error => {
                console.log(error);
                this.notify("Error!", `Failed to delete. Check console for more information.`, ToasterTypes.FAILURE);
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
            uuid, savedTimestamp, shipName, shipDestination, cargo, 
            decks, tool, showCreationPanel, showLoadingPanel, loading
        } = this.state;
        
        let deckElements;

        if (decks.length > 0) {
            deckElements = decks.map(deck => {
                // Get all cargo elements for the current deck
                const cargoElements = cargo
                    .filter(cargo => cargo.deckIndex === deck.index)
                    .map(cargo => {
                        return (
                            <Cargo 
                                key={cargo.cargoIndex}
                                index={cargo.cargoIndex} 
                                selected={cargo.selected} 
                                hazardous={cargo.hazardous}
                                preview={false}
                                coords={cargo.coords} 
                                type={cargo.cargoType} />
                        );
                    });

                return (
                    <Deck 
                        key={deck.index}
                        deckIndex={deck.index}
                        width={deck.width}
                        height={deck.height}
                        visible={deck.visible}
                        tool={tool}
                        name={shipName}
                        deckName={deck.name}
                        getCargoInformation={this.getCargoInformation}
                        moveCargo={this.moveCargo}
                        addCargo={this.addCargo}
                        setDeckRef={this.setDeckRef}
                        selectCargo={this.selectCargo}
                        deselectCargo={this.deselectCargo}
                        selectMultipleCargo={this.selectMultipleCargo}>
                        
                        {cargoElements}
                    </Deck>
                )
            })
        }

        return (
            <div className="Sketcher">
                <MenuBar 
                    togglePanel={this.togglePanel}
                    showCreationPanel={showCreationPanel}
                    showLoadingPanel={showLoadingPanel}
                    savedTimestamp={savedTimestamp} 
                    sketchLoaded={uuid}
                    saveSketch={this.saveSketch}
                    exportSketch={this.exportSketch}
                    />

                <div className="Sketcher__Window">
                    <Toolbar
                        selectedTool={tool}
                        updateTool={this.updateTool}
                    />

                    <InfoPanel
                        shipName={shipName}
                        shipDestination={shipDestination}
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
                            deleteSketch={this.deleteSketch}
                            overwriteSketch={this.overwriteSketch} /> }
                        <MoonLoader loading={loading} size={35} color={"#fff"} />
                    </Diffuser>

                    <Toasty timeToClose={4000} ref={this.toastyRef} />

                    {deckElements}
                </div>
            </div>
        );
    }
}

export default Sketcher;