import React from "react";
import "./Canvas.scss";

export interface Canvas {
    canvasRef: any;
    ctx: any;
}

export interface CanvasProps {
    selectedTool: string;
    gridSize: number;
    addCargo: any;
    removeCargo: any;
}

export class Canvas extends React.Component<CanvasProps, any> {
    constructor(props: CanvasProps) {
        super(props);

        this.canvasRef = React.createRef();
        this.ctx = null;
    }

    public state = {
        windowDimensions: { width: null, height: null },
        coords: { x: null, y: null },
    };

    componentDidMount(): void {
        // Get context via canvas ref
        this.ctx = this.canvasRef.current.getContext("2d");
        this.handleResize()

        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.handleResize);
    }

    // Get height and width of the current browser window.
    public getWindowDimensions = (): any => {
        return { width: window.innerWidth, height: window.innerHeight }        
    };

    // TODO redraw canvas elements on resize
    // Update windowDimensions and adjust the canvas size + grid accordingly.
    // Canvas render size is doubled to get a higher resolution image.
    private handleResize = () => {
        this.setState({ windowDimensions: this.getWindowDimensions() }, () => {
            this.canvasRef.current.width = this.state.windowDimensions.width * 2;
            this.canvasRef.current.height = this.state.windowDimensions.height * 2;
            this.drawGrid();
        });
    };

    // Draw background grid depending on the given gridSize.
    private drawGrid = (): void => {
        const { width, height } = this.state.windowDimensions;

        this.ctx.beginPath();

        for ( var x = 0; x <= width * 2; x += this.props.gridSize ) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height * 2);
        }

        for ( var y = 0; y <= height * 2; y += this.props.gridSize ) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width * 2, y);
        }

        this.ctx.strokeStyle = "#c8c8c8";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    private handleClick = (e): void => {
        if (this.props.selectedTool === 'clear') {
            // this.props.removeCargo(0);

        } else {
            this.placeCargoElement(this.props.selectedTool);
            this.props.addCargo(this.props.selectedTool, 1, this.state.coords);
        }
    }

    private placeCargoElement = (cargoType: string): void => {
        const [ x, y ] = Object.values(this.state.coords).map(el => el * 2);

        this.ctx.beginPath();
        this.ctx.lineWidth = 15;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 10, y + 10);
        this.ctx.strokeStyle = '#333';
        this.ctx.stroke();
        this.ctx.closePath();
    }

    // Updating the cursor position state on every mouse movement.
    // 0,0 is set to be the top-left of the canvas element by using the getBoundingClientRect func.
    private handleMouseMove = ({ clientX, clientY }: any) => {
        const boundingRect = this.canvasRef.current.getBoundingClientRect();
        this.setState({ coords: { x: clientX - boundingRect.left, y: clientY - boundingRect.top } })
    };

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                onClick={this.handleClick}
                onMouseMove={this.handleMouseMove} />
        );
    }
}

export default Canvas;
