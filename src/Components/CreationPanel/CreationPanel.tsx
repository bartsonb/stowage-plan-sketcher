import React from "react";
import Form from "../Form/Form";
import './CreationPanel.scss';

export interface CreationPanelProps {
    show: boolean;
    createShip: any;
}

export class CreationPanel extends React.Component<CreationPanelProps, any> {
    constructor(props: CreationPanelProps) {
        super(props);

        this.state = {
            shipName: '',
            numberOfDecks: ''
        }
    }

    private handleSubmit = (event) => {
        event.preventDefault();
        this.props.createShip(this.state.shipName, this.state.numberOfDecks);
    }

    private handleChange = ({ target }) => {
        this.setState({
            [target.name]: target.value
        });
    }

    render() {
        if (this.props.show) {
            return (
                <div className="CreationPanel">
                    <Form handleSubmit={this.handleSubmit}>
                        <h1>Create a new ship</h1>
                        <input 
                            onChange={event => {this.handleChange(event)}} 
                            type="text" 
                            name="shipName" 
                            placeholder="Name of ship" value={this.state.shipName} />

                        <input 
                            onChange={event => {this.handleChange(event)}} 
                            type="number" 
                            name="numberOfDecks" 
                            placeholder="Number of decks" value={this.state.numberOfDecks} />

                        <input type="submit" value="Create" />
                    </Form>
                </div>
            )
        }
    }
}

export default CreationPanel;