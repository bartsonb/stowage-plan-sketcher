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
    selectedDeck: number;    
    handleClick: any;
    moveCargo: any;
    changeDeck: any;
    children?: any;
    getSelectionBoxCoords: any;
}

export class Ship extends React.Component<ShipProps, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            mousePosOld : { x: 0, y: 0},
            mousePos: { x: 0, y: 0 },
            selectionBox: { pos: { x: 0, y: 0 }, width: 0, height: 0 },
            shipPadding: 50,
            displayPreviewCargo: false,
            isDragging: false,
            isMoving: false
        }

        this.deckRef = React.createRef();
    }

    // Handling the mouse movement to save mouse position
    // and normalizing the coords to be relative to the deck div.
    public handleMouseMove = ({ clientX, clientY }): void => {
        const boundingRect = this.deckRef.current.getBoundingClientRect();
        this.setState(prevState => {
            return { 
                mousePosOld: { ...prevState.mousePos },
                mousePos: { x: clientX - boundingRect.left, y: clientY - boundingRect.top }
            }
        }, () => {

            // Set width and height for selection box while dragging
            if (this.state.isDragging) {
                const w = this.state.mousePos.x - this.state.selectionBox.pos.x;
                const h = this.state.mousePos.y - this.state.selectionBox.pos.y;

                this.setState({
                    selectionBox: { width: w + 'px', height: h + 'px', pos: this.state.selectionBox.pos }
                });
            }

            // Move cargo while isMoving is true
            if (this.state.isMoving) {
                this.props.moveCargo(
                    this.state.mousePosOld.x, this.state.mousePosOld.y, 
                    this.state.mousePos.x, this.state.mousePos.y
                );
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

    // Added 4px to selection box position, so the selection box div doesn't get in the way of
    // other click events.
    // Also making sure that the drag only registers on the background and not on a cargo element.
    private handleMouseDown = (event: any): void => {
        const { target: { className }} = event;

        if (this.props.tool === 'select' && className.includes('Deck')) {
            this.setState({ 
                isDragging: true,
                selectionBox: { pos: { x: this.state.mousePos.x + 4, y: this.state.mousePos.y + 4 } }
            }) 
        }

        // MouseDown on Cargo
        if (this.props.tool === 'select' && className.includes('Cargo')) {
            this.setState({
                isMoving: true
            });
        }
    }

    // Only end dragging status if dragging status was true.
    private handleMouseUp = (): void => { 
        if (this.props.tool === 'select' && this.state.isDragging) {
            this.props.getSelectionBoxCoords(this.state.selectionBox.pos, this.state.mousePos);
            this.setState({ isDragging: false });
        }

        if (this.props.tool === 'select' && this.state.isMoving) {
            this.setState({ isMoving: false })
        }
    }

    render() {
        const { name, selectedDeck, decks, changeDeck } = this.props;
        const { shipPadding } = this.state;

        const deckChangingButtons = decks.map((el, index) => {
            return (
                <button 
                    className={`Ship__Tabs__Button Ship__Tabs__Button${index === selectedDeck ? '--active': ''}`}
                    key={index} 
                    onClick={() => {changeDeck(index)}}>
                        {index + 1}
                </button>
            )
        })

        return (
            <div className="ShipWindow">    
                <div className="ShipWindow__Handle"></div>
                <div 
                    className="Ship"
                    onMouseMove={this.handleMouseMove}
                    style={{ 
                        width: decks[selectedDeck].width + shipPadding, 
                        height: decks[selectedDeck].height + shipPadding 
                    }}>
                    
                    <div className="Ship__Tabs">
                        {deckChangingButtons}
                    </div>

                    <div 
                        className="Ship__Deck"
                        style={{ 
                            width: decks[selectedDeck].width, 
                            height: decks[selectedDeck].height, 
                            left: shipPadding / 2 
                        }}
                        ref={this.deckRef}
                        onClick={(event) => {this.props.handleClick(event, null, this.state.mousePos)}}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                        onMouseDown={event => {this.handleMouseDown(event)}}
                        onMouseUp={this.handleMouseUp}>   

                        {this.getSelectionBox()}
                        {this.getPreviewCargo()}
                        {this.props.children}
                    </div>

                </div>
            </div>
        )
    }
}

export default Ship;