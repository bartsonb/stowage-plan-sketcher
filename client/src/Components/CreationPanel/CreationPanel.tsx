import React from "react";
import Box from "../Box/Box";
import Form from "../Form/Form";
import "./CreationPanel.scss";

export interface CreationPanel {
    deckMinWidth: number;
    deckMinHeight: number;
    shipNameMinLength: number;
    deckNameMinLength: number;
}

export interface CreationPanelProps {
    shipName: string;
    shipDestination: string;
    decks: any[];
    show: boolean;
    updateSketch(shipName: string, shipDestination: string, decks: object): void;
    togglePanel(name: string): void;
}

export class CreationPanel extends React.Component<CreationPanelProps, any> {
    constructor(props: CreationPanelProps) {
        super(props);

        this.state = {
            shipName: this.props.shipName || "",
            shipDestination: this.props.shipDestination || "",
            decks: this.props.decks || []
        };

        this.deckMinWidth = 199;
        this.deckMinHeight = this.deckMinWidth;
        this.shipNameMinLength = 5;
        this.deckNameMinLength = 3;
    }

    private handleSubmit = (event: any): void => {
        if (this.isFormValid()) {
            this.props.updateSketch(this.state.shipName, this.state.shipDestination, this.state.decks);
            this.props.togglePanel("create");
        }
    };

    private addNewDeck = (event: any): void => {
        this.setState((prevState) => {
            // Gets the highest index in the decks array.
            // If decks are empty, index is 0.
            const deckIndex = prevState.decks.reduce((acculumator, el) => {
                acculumator = (acculumator < el.index) 
                    ? el.index 
                    : acculumator;
            }, 0);

            return {
                decks: [
                    ...prevState.decks,
                    {
                        index: deckIndex,
                        name: "",
                        width: 0,
                        height: 0,
                        visible: true,
                    },
                ]
            };
        });
    };

    private removeDeck = (deckIndex): void => {
        this.setState((prevState) => {
            const newDeckState = prevState.decks.filter((el, index) => index !== deckIndex);

            return { decks: newDeckState };
        });
    }

    // Handles change of ship name.
    private handleNameChange = ({ target }: any): void => {
        this.setState({
            shipName: target.value,
        });
    };

    // Handles change of ship destination.
    private handleDestinationChange = ({ target }: any): void => {
        this.setState({
            shipDestination: target.value,
        });
    };

    // Handle data change on decks
    private handleDeckChange = (
        event: any,
        deckIndex: number,
        type: string
    ) => {
        const {
            target: { value },
        } = event;

        this.setState((prevState) => {
            // If deck with given index already exist, change value and setState.
            // Else create new deck object with a new given key.
            if (typeof prevState.decks[deckIndex] === "object") {
                if (type === "width" || type === "height") {
                    prevState.decks[deckIndex][type] = parseInt(value);

                    return { decks: [...prevState.decks] };
                } else {
                    prevState.decks[deckIndex][type] = value;

                    return { decks: [...prevState.decks] };
                }
            } else {
                return { decks: [...prevState.decks, { [type]: value }] };
            }
        });
    };

    private isFormValid = (): boolean => {
        const finishedDecks = this.state.decks.filter((el) => {
            if (el.hasOwnProperty("height") && el.hasOwnProperty("width")) {
                return (
                    el.width > this.deckMinWidth &&
                    el.height > this.deckMinHeight
                );
            }

            return false;
        });

        return (
            finishedDecks.length > 0 &&
            finishedDecks.length === this.state.decks.length &&
            this.state.shipName.length > this.shipNameMinLength
        );
    };

    render() {
        const getDeckInputs = () => {
            let deckInputs = [];

            this.state.decks.map(el => {
                deckInputs.push(
                    <div className="CreationPanel__Deck__Element" key={el.index}>
                        <div className="CreationPanel__Deck__Element__Inputs">
                            <fieldset>
                                <label htmlFor="Deck name">Deck name</label>
                                <input
                                    type="text"
                                    placeholder="Deck name"
                                    name="deckName"
                                    value={el.name}
                                    onChange={(event) => {
                                        this.handleDeckChange(
                                            event,
                                            el.index,
                                            "name"
                                        );
                                    }}
                                />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="width">Width</label>
                                <input
                                    type="number"
                                    name="width"
                                    value={el.width}
                                    placeholder="0"
                                    onChange={(event) => {
                                        this.handleDeckChange(
                                            event,
                                            el.index,
                                            "width"
                                        );
                                    }}
                                />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="height">Height</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={el.height}
                                    placeholder="0"
                                    onChange={(event) => {
                                        this.handleDeckChange(
                                            event,
                                            el.index,
                                            "height"
                                        );
                                    }}
                                />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="delete">Delete</label>
                                <button onClick={() => {this.removeDeck(el.index)}} name="delete">x</button>
                            </fieldset>
                        </div>
                    </div>
                );
            });

            return deckInputs;
        };

        if (this.props.show) {
            return (
                <Box cssClass="CreationPanel" title="Create & Edit">
                    <Form handleSubmit={this.handleSubmit}>
                        <div className="CreationPanel__Main">
                            <input
                                onChange={(event) => {
                                    this.handleNameChange(event);
                                }}
                                type="text"
                                name="shipName"
                                className="CreationPanel__Main__ShipName"
                                placeholder="Name of ship"
                                value={this.state.shipName}
                            />

                            <input
                                onChange={(event) => {
                                    this.handleDestinationChange(event);
                                }}
                                type="text"
                                name="shipDestination"
                                className="CreationPanel__Main__ShipDestination"
                                placeholder="Ship destination"
                                value={this.state.shipDestination}
                            />

                            <button
                                onClick={this.addNewDeck}
                                className="CreationPanel__Main__AddDeck"
                            >
                                Add Deck
                            </button>
                        </div>

                        <div className="CreationPanel__Deck">
                            {getDeckInputs()}
                        </div>

                        <input
                            type="submit"
                            className="CreationPanel__Submit"
                            disabled={!this.isFormValid()}
                            value="Update sketch"
                        />
                    </Form>
                </Box>
            );
        }
    }
}

export default CreationPanel;
