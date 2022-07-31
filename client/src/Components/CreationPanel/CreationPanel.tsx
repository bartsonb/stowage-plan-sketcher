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
    show: boolean;
    createSketch(shipName: string, decks: object): void;
}

export class CreationPanel extends React.Component<CreationPanelProps, any> {
    constructor(props: CreationPanelProps) {
        super(props);

        this.state = {
            shipName: "",
            decks: [],
            numberOfDecks: 0,
        };

        this.deckMinWidth = 199;
        this.deckMinHeight = this.deckMinWidth;
        this.shipNameMinLength = 5;
        this.deckNameMinLength = 3;
    }

    private handleSubmit = (event: any): void => {
        if (this.isFormValid()) {
            this.props.createSketch(this.state.shipName, this.state.decks);
        }
    };

    // Handles change of ship name.
    private handleNameChange = ({ target }: any): void => {
        this.setState({
            shipName: target.value,
        });
    };

    // Increases the number of decks by 1.
    private increaseNumberOfDecks = (event: any): void => {
        this.setState({
            numberOfDecks: this.state.numberOfDecks + 1,
        });
    };

    // Handle creation of decks
    private handleDeckChange = (event: any, deckIndex: number, type: string) => {
        const {target: { value }} = event;

        this.setState((prevState) => {
            // If deck with given index already exist, change value and setState.
            // Else create new deck object with a new given key.
            if (typeof prevState.decks[deckIndex] === "object") {
                if (type === 'width' || type === 'height') {
                    prevState.decks[deckIndex][type] = parseInt(value);

                    return { decks: [...prevState.decks] };
                } else {
                    prevState.decks[deckIndex][type] = value;

                    return { decks: [...prevState.decks] };
                }
            } else {
                return { decks: [...prevState.decks, { [type]: value, visible: true }] };
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
            finishedDecks.length === this.state.numberOfDecks && 
            this.state.shipName.length > this.shipNameMinLength
        )
    }

    render() {
        const getDeckInputs = () => {
            let deckInputs = [];

            for (let index = 0; index < this.state.numberOfDecks; index++) {
                deckInputs.push(
                    <div className="CreationPanel__Deck__Element" key={index}>
                        <div className="CreationPanel__Deck__Element__Inputs">
                            <fieldset>
                                <label htmlFor="Deck name">Deck name</label>
                                <input
                                    type="text"
                                    placeholder="Deck name"
                                    name="deckName"
                                    onChange={(event) => {
                                        this.handleDeckChange(
                                            event,
                                            index,
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
                                    placeholder="0"
                                    onChange={(event) => {
                                        this.handleDeckChange(
                                            event,
                                            index,
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
                                    placeholder="0"
                                    onChange={(event) => {
                                        this.handleDeckChange(
                                            event,
                                            index,
                                            "height"
                                        );
                                    }}
                                />
                            </fieldset>
                        </div>
                    </div>
                );
            }

            return deckInputs;
        };

        if (this.props.show) {
            return (
                <Box cssClass="CreationPanel" title="Create new sketch">
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

                            <button
                                onClick={this.increaseNumberOfDecks}
                                className="CreationPanel__Main__AddDeck"
                                value={this.state.numberOfDecks}
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
                        />
                    </Form>
                </Box>
            );
        }
    }
}

export default CreationPanel;
