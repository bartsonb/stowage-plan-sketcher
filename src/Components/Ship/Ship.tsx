import React from "react";
import './Ship.scss';

export interface Ship {
    deckRef: any;
}

export interface ShipProps {
    name: string;
    decks: any;
    handleClick: any;
    children?: any;
}

export class Ship extends React.Component<ShipProps, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            mousePosition: { x: null, y: null }
        }

        this.deckRef = React.createRef();
    }

    public handleMouseMove = ({ clientX, clientY }): void => {
        const boundingRect = this.deckRef.current.getBoundingClientRect();
        this.setState({ mousePosition: { x: clientX - boundingRect.left, y: clientY - boundingRect.top } });
    }

    render() {
        return (
            <div 
                className="Ship"
                onMouseMove={this.handleMouseMove}>
                <div className="Ship__Description">
                    <p>{this.props.name}</p>
                </div>
                <div 
                    className="Ship__Deck" 
                    ref={this.deckRef}
                    onClick={(event) => {this.props.handleClick(event, null, this.state.mousePosition)}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Ship;