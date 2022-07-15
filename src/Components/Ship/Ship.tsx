import { timeStamp } from "console";
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
    getSelectionBoxCoords: any;
}

export class Ship extends React.Component<ShipProps, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            mousePos: { x: null, y: null },
            selectionBox: { pos: { x: 0, y: 0 }, width: 0, height: 0 },
            displayPreviewCargo: false,
            isDragging: false
        }

        this.deckRef = React.createRef();
    }

    // Handling the mouse movement to save mouse position
    // and normalizing the coords to be relative to the deck div.
    public handleMouseMove = ({ clientX, clientY }): void => {
        const boundingRect = this.deckRef.current.getBoundingClientRect();
        this.setState({ mousePos: { x: clientX - boundingRect.left, y: clientY - boundingRect.top } }, () => {

            // Set width and height for selection box while dragging
            if (this.state.isDragging) {
                const w = this.state.mousePos.x - this.state.selectionBox.pos.x;
                const h = this.state.mousePos.y - this.state.selectionBox.pos.y;

                this.setState({
                    selectionBox: { width: w + 'px', height: h + 'px', pos: this.state.selectionBox.pos }
                });
            }
        });
    }

    //  Return the preview cargo element that is positioned at the user's mouse cursor.
    private getPreviewCargo = () => {
        if (this.state.displayPreviewCargo && ['container', 'box'].includes(this.props.tool)) {
            return <Cargo type={this.props.tool} preview={true} coords={this.state.mousePos} /> 
        }
    }

    // Return the selection box
    private getSelectionBox = () => {
        // checking if the user is dragging and making sure that the selection box
        // coords have already been updated.
        if (this.state.isDragging && this.state.selectionBox.pos.hasOwnProperty('x')) {
            return (
                <div 
                    className="Ship__Deck__Selection"
                    style={{ 
                        left: this.state.selectionBox.pos.x,  
                        top: this.state.selectionBox.pos.y,
                        width: this.state.selectionBox.width, 
                        height: this.state.selectionBox.height
                    }}>
                </div>
            )
        }
    }

    // Handle mouseEnter and mouseLeave
    private handleMouseEnter = () => { 
        if (['container', 'box'].includes(this.props.tool)) {
            this.setState({ displayPreviewCargo: true }) 
        }
    };

    private handleMouseLeave = () => { 
        if (this.props.tool === 'select') {
            this.props.getSelectionBoxCoords(this.state.selectionBox.pos, this.state.mousePos);
        }

        this.setState({ displayPreviewCargo: false, isDragging: false }) 
    };

    // Added 4 to selection box position, so the selection box div doesn't get in the way of
    // all other click events.
    private handleMouseDown = () => { 
        if (this.props.tool === 'select') {
            this.setState({ 
                isDragging: true,
                selectionBox: { pos: { x: this.state.mousePos.x + 4, y: this.state.mousePos.y + 4 } }
            }) 
        }
    }

    private handleMouseUp = () => { 
        if (this.props.tool === 'select') {
            this.props.getSelectionBoxCoords(this.state.selectionBox.pos, this.state.mousePos);
            this.setState({ isDragging: false });
        }
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
                    onClick={(event) => {this.props.handleClick(event, null, this.state.mousePos)}}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}>   

                    {this.getSelectionBox()}
                    {this.getPreviewCargo()}
                    {this.props.children}
                </div>

            </div>
        )
    }
}

export default Ship;