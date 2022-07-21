import React from "react";
import Box from "../Box/Box";
import Cargo from "../Cargo/Cargo";
import './Ship.scss';

export interface Ship {
    deckRef: any;
}

export interface ShipProps {
    deckIndex: number;
    deckName: string;
    name: string;
    width: number;
    height: number;
    visible: boolean;
    tool: string;
    handleClick: any;
    moveCargo: any;
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
            displayPreviewCargo: false,
            isDragging: false,
            isMoving: false
        }

        this.deckRef = React.createRef();
    }

    componentDidMount(): void {
        this.setState({
            deckIndex: this.props.deckIndex
        });
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
            this.props.getSelectionBoxCoords(this.state.selectionBox.pos, this.state.mousePos, this.props.deckIndex);
        }

        this.setState({ displayPreviewCargo: false, isDragging: false }) 
    };

    // Adding 4px to selection box position, so the selection box div doesn't get in the way of
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
            this.props.getSelectionBoxCoords(this.state.selectionBox.pos, this.state.mousePos, this.props.deckIndex);
            this.setState({ isDragging: false });
        }

        if (this.props.tool === 'select' && this.state.isMoving) {
            this.setState({ isMoving: false })
        }
    }

    render() {
        const { deckName, name, deckIndex, width, height, visible } = this.props;

        // Only show Ship element if "visible" prop is true.
        if (visible) {
            return (
                <Box 
                    cssClass="Ship" 
                    title={`${name} - ${deckName} [${deckIndex + 1}]`}
                    sizing={{ 
                        width: (width + 32) + "px",
                        height: (height + 55) + "px",
                        x: (window.innerWidth / 2) - (width / 2), 
                        y: (window.innerHeight / 2) - (height / 1.7)
                    }}>
                    <div 
                        className="Ship__Deck"
                        style={{
                            width: width + "px",
                            height: height + "px"
                        }}
                        onMouseMove={this.handleMouseMove}
                        ref={this.deckRef}
                        onClick={(event) => {this.props.handleClick(event, null, this.state.mousePos, deckIndex)}}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                        onMouseDown={event => {this.handleMouseDown(event)}}
                        onMouseUp={this.handleMouseUp}>   

                        {this.getSelectionBox()}
                        {this.getPreviewCargo()}
                        {this.props.children}
                    </div>
                </Box>
            )
        }
    }
}

export default Ship;