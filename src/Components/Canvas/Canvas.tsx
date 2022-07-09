import React from "react";
import "./Canvas.scss";

export interface Canvas {
    canvasRef: any | null;
    ctx: any | null;
    setCanvasRef: object;
}

export interface CanvasProps {
    gridSize: number;
    divider: number;
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

    // Update windowDimensions and adjust the canvas size + grid accordingly.
    // windowDimensions are doubled to get a higher resolution image.
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

        console.log(width, ' ', height);

        for ( var x = 0; x <= width * 2; x += this.props.gridSize ) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height * 2);
        }

        for ( var y = 0; y <= height * 2; y += this.props.gridSize ) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width * 2, y);
        }

        this.ctx.strokeStyle = "#ccc";
        this.ctx.stroke();
    }

    // Updating the cursor position state on every mouse movement.
    public handleMouseMove = ({ clientX, clientY }: any) => this.setState({ coords: { x: clientX, y: clientY } });

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                onMouseMove={this.handleMouseMove} />
        );
    }
}

export default Canvas;
