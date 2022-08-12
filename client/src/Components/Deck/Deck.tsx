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
    setDeckRef(deckIndex: number, ref: any): void;
    deselectCargo(): void;
    selectMultipleCargo(coords1: {x, y}, coords2: {x, y}, deckIndex): any;
}

export class Deck extends React.Component<DeckProps, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            startPos: { x: null , y: null  },
            mousePos: { x: 0, y: 0, moveX: 0, moveY: 0 },
            displayPreviewCargo: false,
            isSelecting: false,
            isMoving: false
        }

        this.deckRef = React.createRef();
    }

    componentDidMount(): void {
        // Save deckRef to sketcher state.
        this.props.setDeckRef(this.props.deckIndex, this.deckRef.current);
    }

    // Handling the mouse movement
    public handleMouseMove = ({ clientX, clientY, movementX, movementY }): void => {
        const { startPos, mousePos, isMoving } = this.state;

        this.setState(() => {
            const [x, y] = this.getRelativeCoords(clientX, clientY);

            return { 
                displayPreviewCargo: isCargoTool(this.props.tool),
                mousePos: { x, y, moveX: movementX, moveY: movementY }, 
                isSelecting: (!isMoving && this.enoughDistanceForDrag(startPos.x, startPos.y, x, y))
            }
        }, () => {
            if (isMoving) this.props.moveCargo(mousePos.moveX, mousePos.moveY);
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

    private handleMouseUp = (): void => { 
        const { isSelecting, mousePos, startPos } = this.state;

        // mouseUp counts as click, when not enough distance was traveled after mouseDown.
        // see: enoughDistanceForDrag().
        if (!isSelecting) {
            console.log('click');
            this.props.deselectCargo();
        }

        if (isSelectTool(this.props.tool) && isSelecting) {
            this.props.selectMultipleCargo(startPos, mousePos, this.props.deckIndex);
        }

        this.setState({
            startPos: { x: null, y: null },
            isSelecting: false, 
            isMoving: false
        })
    }

    private handleMouseLeave = () => { 
        const { isSelecting, mousePos, startPos } = this.state;

        // End selection box, when mouse leaves the deck while dragging.
        if (isSelectTool(this.props.tool) && isSelecting) {
            this.props.selectMultipleCargo(startPos, mousePos, this.props.deckIndex);
        }

        this.setState({ 
            startPos: { x: null, y: null },
            isSelecting: false,
            displayPreviewCargo: false 
        }) 
    };

    // Compares two sets of coordinates and check if the distance is greater
    // than the given delta.
    private enoughDistanceForDrag = (x1, y1, x2, y2) => {
        if (x1 === null || x2 === null) return false;

        const delta = 3; 
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
        const { startPos, mousePos } = this.state;

        // checking if the user is dragging and making sure that the selection box
        // coords have already been updated.
        if (this.state.isSelecting) {
            return (
                <div 
                    className="Deck Deck__Selection"
                    style={{ 
                        left: startPos.x,
                        top: startPos.y,
                        width: (mousePos.x - startPos.x) + "px", 
                        height: (mousePos.y - startPos.y) + "px", 
                    }}>
                </div>
            )
        }
    }

    render() {
        const { deckName, name, deckIndex, width, height, visible } = this.props;
        const [ paddingWidth, paddingHeight ] = [30, 55];

        let stateView = [];

        for (const key in this.state) {
            const showKey = ['startPos', 'isSelecting', 'isMoving', 'displayPreviewCargo'];
            if (showKey.includes(key)) stateView.push(<p style={{ color: "#222"}}>{key}: {JSON.stringify(this.state[key])}</p> )
        }

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
                    {stateView}
                    {this.getSelectionBox()}
                    {this.getPreviewCargo()}
                    {this.props.children}
                </div>
            </Box>
        )
    }
}

export default Deck;