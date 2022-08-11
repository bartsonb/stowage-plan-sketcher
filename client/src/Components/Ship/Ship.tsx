import React from "react";
import Box from "../Box/Box";
import Cargo from "../Cargo/Cargo";
import { isCargoTool, isSelectTool } from "../Toolbar/Toolbar";
import './Ship.scss';

export type deck = {
    index: number, 
    name: string,
    visible: boolean,
    width: number,
    height: number
}

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
    children?: any;
    setDeckRef(deckIndex: number, ref: any);
    moveCargo: any;
    handleClick: any;
    getSelectionBoxCoords: any;
}

export class Ship extends React.Component<ShipProps, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            mousePos: { x: 0, y: 0, moveX: 0, moveY: 0 },
            selectionBox: { pos: { x: 0, y: 0 }, width: 0, height: 0 },
            displayPreviewCargo: false,
            isDragging: false,
            isMoving: false
        }

        this.deckRef = React.createRef();
    }

    componentDidMount(): void {
        // Save deckRef to sketcher state.
        this.props.setDeckRef(this.props.deckIndex, this.deckRef.current);
    }

    // Handling the mouse movement to save mouse position
    // and normalizing the coords to be relative to the deck div.
    public handleMouseMove = ({ clientX, clientY, movementX, movementY }): void => {
        const { mousePos, selectionBox, isDragging, isMoving } = this.state;
        const boundingRect = this.deckRef.current.getBoundingClientRect();

        this.setState(() => {
            return { 
                mousePos: { 
                    x: clientX - boundingRect.left, 
                    y: clientY - boundingRect.top,
                    moveX: movementX,
                    moveY: movementY
                }
            }
        }, () => {

            // Set width and height for selection box while dragging
            if (isDragging) {
                const w = mousePos.x - selectionBox.pos.x;
                const h = mousePos.y - selectionBox.pos.y;

                this.setState({
                    selectionBox: { width: w + 'px', height: h + 'px', pos: selectionBox.pos }
                });
            }

            // Move cargo while isMoving is true
            if (isMoving) {
                this.props.moveCargo(mousePos.moveX, mousePos.moveY);
            }
        });
    }

    //  Return the preview cargo element that is positioned at the user's mouse cursor.
    private getPreviewCargo = () => {
        if (this.state.displayPreviewCargo && isCargoTool(this.props.tool)) {
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
        if (isCargoTool(this.props.tool)) {
            this.setState({ displayPreviewCargo: true }) 
        }
    };

    private handleMouseLeave = () => { 
        if (isSelectTool(this.props.tool) && this.state.isDragging) {
            this.props.getSelectionBoxCoords(this.state.selectionBox.pos, this.state.mousePos, this.props.deckIndex);
        }

        this.setState({ displayPreviewCargo: false, isDragging: false }) 
    };

    // Adding 4px to selection box position, so the selection box div doesn't get in the way of
    // other click events.
    // Also making sure that the drag only registers on the background and not on a cargo element.
    private handleMouseDown = (event: any): void => {
        const { target: { className }} = event;

        if (isSelectTool(this.props.tool) && className.includes('Deck')) {
            this.setState({ 
                isDragging: true,
                selectionBox: { pos: { x: this.state.mousePos.x + 4, y: this.state.mousePos.y + 4 } }
            }) 
        }

        // MouseDown on Cargo
        if (isSelectTool(this.props.tool) && className.includes('Cargo')) {
            this.setState({
                isMoving: true
            });
        }
    }

    // Only end dragging status if dragging status was true.
    private handleMouseUp = (): void => { 
        if (isSelectTool(this.props.tool) && this.state.isDragging) {
            this.props.getSelectionBoxCoords(this.state.selectionBox.pos, this.state.mousePos, this.props.deckIndex);
            this.setState({ isDragging: false });
        }

        if (isSelectTool(this.props.tool) && this.state.isMoving) {
            this.setState({ isMoving: false })
        }
    }

    render() {
        const { deckName, name, deckIndex, width, height, visible } = this.props;
        const [ paddingWidth, paddingHeight ] = [30, 55];

        return (
            <Box
                hide={!visible}
                cssClass="Ship" 
                title={`${name} - ${deckName} [${deckIndex + 1}]`}
                sizing={{
                    top: ((window.innerHeight / 2) - (height / 2) - paddingHeight) + "px", 
                    left: ((window.innerWidth / 2) - (width / 2) - paddingWidth) + "px",
                    position: "absolute"
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

export default Ship;