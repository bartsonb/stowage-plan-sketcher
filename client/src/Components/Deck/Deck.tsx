import React from "react";
import Box from "../Box/Box";
import Cargo from "../Cargo/Cargo";
import { isCargoTool, isSelectTool } from "../Toolbar/Toolbar";
import './Deck.scss';

export type deck = {
    index: number, 
    name: string,
    visible: boolean,
    width: number,
    height: number
}

export interface Deck {
    deckRef: any;
}

export interface DeckProps {
    deckIndex: number;
    deckName: string;
    name: string;
    width: number;
    height: number;
    visible: boolean;
    tool: string;
    children?: any;
    moveCargo: any;
    setDeckRef(deckIndex: number, ref: any);
    selectMultipleCargo(coords1: {x, y}, coords2: {x, y}, deckIndex): any;
}

export class Deck extends React.Component<DeckProps, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            startPos: { x: 0, y: 0 },
            mousePos: { x: 0, y: 0, moveX: 0, moveY: 0 },
            selectionBox: { width: 0, height: 0 },
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
        const { startPos, mousePos, isDragging, isMoving } = this.state;

        this.setState(() => {
            const [x, y] = this.getRelativeCoords(clientX, clientY);

            return { 
                displayPreviewCargo: isCargoTool(this.props.tool),
                mousePos: { x, y, moveX: movementX, moveY: movementY }, 
                isDragging: this.enoughDistanceForDrag(startPos.x, startPos.y, x, y)
            }
        }, () => {

            // Set width and height for selection box while dragging
            if (isDragging) {
                this.setState({ 
                    selectionBox: { 
                        width: mousePos.x - startPos.x + "px", 
                        height: mousePos.y - startPos.y + "px" 
                    } 
                });
            }

            // Move cargo while isMoving is true
            if (isMoving) {
                this.props.moveCargo(mousePos.moveX, mousePos.moveY);
            }
        });
    }

    private handleMouseDown = (event: any): void => {
        const { target: { className }} = event;
        const [x, y] = this.getRelativeCoords(event.clientX, event.clientY);

        // Set start position of mouseDown
        this.setState({ startPos: { x, y } });

        // MouseDown on Cargo
        if (isSelectTool(this.props.tool) && className.includes('Cargo')) {
            this.setState({ isMoving: true }); 
        }
    }

    // Only end dragging status if dragging status was true.
    private handleMouseUp = (): void => { 
        if (isSelectTool(this.props.tool) && this.state.isDragging) {
            this.props.selectMultipleCargo(this.state.startPos, this.state.mousePos, this.props.deckIndex);
        }

        if (isSelectTool(this.props.tool) && this.state.isMoving) {
            this.setState({ isMoving: false })
        }

        this.setState({
            isDragging: false
        })
    }

    // Handle mouseLeave
    private handleMouseLeave = () => { 
        if (isSelectTool(this.props.tool) && this.state.isDragging) {
            this.props.selectMultipleCargo(this.state.startPos, this.state.mousePos, this.props.deckIndex);
        }

        this.setState({ displayPreviewCargo: false, isDragging: false }) 
    };

    // Compares two sets of coordinates and check if the distance is greater
    // than the given delta.
    private enoughDistanceForDrag = (x1, y1, x2, y2) => {
        const delta = 6; 

        const diffX = Math.abs(x2 - x1);
        const diffY = Math.abs(y2 - y1);

        return (diffX > delta && diffY > delta);
    }

    private getRelativeCoords = (x, y): any => {
        const boundingRect = this.deckRef.current.getBoundingClientRect();

        return [x - boundingRect.left, y - boundingRect.top];
    }

    //  Return the preview cargo element that is positioned at the user's mouse cursor.
    private getPreviewCargo = () => {
        if (this.state.displayPreviewCargo && isCargoTool(this.props.tool)) {
            return <Cargo type={this.props.tool} preview={true} coords={this.state.mousePos} /> 
        }
    }

    // Return the selection box
    private getSelectionBox = () => {
        const { startPos, selectionBox } = this.state;

        // checking if the user is dragging and making sure that the selection box
        // coords have already been updated.
        if (this.state.isDragging) {
            return (
                <div 
                    className="Deck Deck__Selection"
                    style={{ 
                        left: startPos.x,
                        top: startPos.y,
                        width: selectionBox.width, 
                        height: selectionBox.height
                    }}>
                </div>
            )
        }
    }

    render() {
        const { deckName, name, deckIndex, width, height, visible } = this.props;
        const [ paddingWidth, paddingHeight ] = [30, 55];

        return (
            <Box
                hide={!visible}
                title={`${name} - ${deckName} [${deckIndex + 1}]`}
                sizing={{
                    top: ((window.innerHeight / 2) - (height / 2) - paddingHeight) + "px", 
                    left: ((window.innerWidth / 2) - (width / 2) - paddingWidth) + "px",
                    position: "absolute"
                }}>
                <div
                    className="Deck"
                    style={{
                        width: width + "px",
                        height: height + "px"
                    }}
                    ref={this.deckRef}
                    onMouseMove={this.handleMouseMove}
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

export default Deck;