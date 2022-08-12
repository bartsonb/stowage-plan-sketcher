import React from "react";
import Box from "../Box/Box";
import Form from "../Form/Form";
import { v4 as uuidv4 } from "uuid";
import "./CreationPanel.scss";
import { deck } from "../Deck/Deck";

export interface CreationPanel {
    deckMinWidth: number;
    deckMinHeight: number;
    shipNameMinLength: number;
    deckNameMinLength: number;
}

export interface CreationPanelProps {
    uuid: string;
    shipName: string;
    shipDestination: string;
    decks: any[];
    updateSketch(
        shipName: string,
        shipDestination: string,
        decks: deck[],
        uuid?: string
    ): void;
    togglePanel(name: string): void;
}

export class CreationPanel extends React.Component<CreationPanelProps, any> {
    constructor(props: CreationPanelProps) {
        super(props);

        this.state = {
            uuid: this.props.uuid || uuidv4(),
            shipName: this.props.shipName || "",
            shipDestination: this.props.shipDestination || "",
            decks: this.props.decks || [],
        };

        this.deckMinWidth = 199;
        this.deckMinHeight = this.deckMinWidth;
        this.shipNameMinLength = 5;
        this.deckNameMinLength = 3;
    }

    private handleSubmit = (event: any): void => {
        if (this.isFormValid()) {
            this.props.updateSketch(
                this.state.shipName,
                this.state.shipDestination,
                this.state.decks,
                this.state.uuid
            );

            this.props.togglePanel("CreationPanel");
        }
    };

    private addNewDeck = (event: any): void => {
        this.setState((prevState) => {
            const deckIndices = prevState.decks.map((el) => el.index);
            let index = 0;

            // Check for empty array, because empty arrays in Math.max return -Infinity
            if (deckIndices.length > 0) {
                // Gets the highest index in the decks array and increments it.
                index = Math.max(...prevState.decks.map((el) => el.index)) + 1;
            }

            return {
                decks: [
                    ...prevState.decks,
                    {
                        index: index,
                        name: "",
                        width: "",
                        height: "",
                        visible: true,
                        ref: null
                    },
                ],
            };
        });
    };

    // Remove deck with given index.
    private removeDeck = (deckIndex): void => {
        this.setState((prevState) => {
            const newDeckState = prevState.decks.filter(
                (el) => el.index !== deckIndex
            );

            return { decks: newDeckState };
        });
    };

    // Handles onFocus
    private handleFocus = (event) => event.target.select();

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

    // Handle data change for decks
    private handleDeckChange = (event: any, deckIndex: number, key: string) => {
        const {
            target: { value },
        } = event;

        this.setState((prevState) => {
            const newDeckState = prevState.decks.map((el) => {
                if (el.index === deckIndex) {
                    switch (key) {
                        case "name":
                            return { ...el, [key]: value };
                        case "width":
                        case "height":
                            return { ...el, [key]: parseInt(value) || 0 };
                    }
                }

                return el;
            });

            return { decks: newDeckState };
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

            this.state.decks.map((el) => {
                deckInputs.push(
                    <div
                        className="CreationPanel__Deck__Element"
                        key={el.index}
                    >
                        <div className="CreationPanel__Deck__Element__Inputs">
                            <input
                                type="text"
                                placeholder="Deck name"
                                name="name"
                                value={el.name}
                                onFocus={this.handleFocus}
                                onChange={(event) => {
                                    this.handleDeckChange(
                                        event,
                                        el.index,
                                        "name"
                                    );
                                }}
                            />
                            <input
                                type="number"
                                name="width"
                                value={el.width}
                                placeholder="Width"
                                onFocus={this.handleFocus}
                                onChange={(event) => {
                                    this.handleDeckChange(
                                        event,
                                        el.index,
                                        "width"
                                    );
                                }}
                            />
                            <input
                                type="number"
                                name="height"
                                value={el.height}
                                placeholder="Height"
                                onFocus={this.handleFocus}
                                onChange={(event) => {
                                    this.handleDeckChange(
                                        event,
                                        el.index,
                                        "height"
                                    );
                                }}
                            />
                            <button
                                onClick={() => {
                                    this.removeDeck(el.index);
                                }}
                                name="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            });

            return deckInputs;
        };

        return (
            <Box cssClass="CreationPanel" title="Create & Edit">
                <Form handleSubmit={this.handleSubmit}>
                    <div className="CreationPanel__Category">Main Settings</div>
                    <div className="CreationPanel__Main">
                        <input
                            onChange={(event) => {
                                this.handleNameChange(event);
                            }}
                            type="text"
                            name="shipName"
                            className="CreationPanel__Main__ShipName"
                            placeholder="Name of ship"
                            onFocus={this.handleFocus}
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
                            onFocus={this.handleFocus}
                            value={this.state.shipDestination}
                        />
                    </div>

                    <div
                        className="CreationPanel__Category"
                        style={{
                            display:
                                this.state.decks.length === 0 ? "none" : "flex",
                        }}
                    >
                        Deck settings
                    </div>
                    <div className="CreationPanel__Deck">{getDeckInputs()}</div>

                    <div className="CreationPanel__Category"></div>
                    <div className="CreationPanel__Buttons">
                        <button
                            onClick={this.addNewDeck}
                            className="CreationPanel__Main__AddDeck"
                        >
                            +Deck
                        </button>

                        <input
                            type="submit"
                            className="CreationPanel__Submit"
                            disabled={!this.isFormValid()}
                            value="Confirm"
                        />
                    </div>
                </Form>
            </Box>
        );
    }
}

export default CreationPanel;
