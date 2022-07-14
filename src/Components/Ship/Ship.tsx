import React from "react";
import Cargo from "../Cargo/Cargo";
import './Ship.scss';

export interface Ship {
    deckRef: any;
}

export interface ShipProps {
    tool: string;
    name: string;
    decks: any;
    handleClick: any;
    children?: any;
}

export class Ship extends React.Component<ShipProps, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            mousePosition: { x: null, y: null },
            displayPreviewCargo: false
        }

        this.deckRef = React.createRef();
    }

    public handleMouseMove = ({ clientX, clientY }): void => {
        const boundingRect = this.deckRef.current.getBoundingClientRect();
        this.setState({ mousePosition: { x: clientX - boundingRect.left, y: clientY - boundingRect.top } });
    }

    private getPreviewCargo = (show: boolean) => {
        if (show && ['container', 'box'].includes(this.props.tool)) {
            return <Cargo type={this.props.tool} preview={true} coords={this.state.mousePosition} /> 
        }
    }

    private handleMouseEnter = () => { this.setState({ displayPreviewCargo: true }) };
    private handleMouseLeave = () => { this.setState({ displayPreviewCargo: false }) };

    private handleMouseUp = () => {  }
    private handleMouseDown = () => {  }

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
                    onClick={(event) => {this.props.handleClick(event, null, this.state.mousePosition)}}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}>      
                    
                    {this.getPreviewCargo(this.state.displayPreviewCargo)}
                    {this.props.children}
                </div>

            </div>
        )
    }
}

export default Ship;