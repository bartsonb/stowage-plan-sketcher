import React, { useState, useEffect, useRef } from 'react';
import './Canvas.scss';

export interface CanvasProps {
  gridSize: number;
  divider: number;
}

export const Canvas = (props: CanvasProps) => {
  const { gridSize, divider } = props;
  const [ coords, setCoords ] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null)

  let getWindowDimensions = () => {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  const [ windowDimensions, setWindowDimensions ] = useState(getWindowDimensions());

  useEffect(() => {
    let handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);

    // Get canvas context via ref
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    
    // Set size of the canvas element
    context.canvas.width = windowDimensions.width * 2;
    context.canvas.height = windowDimensions.height * 2;

    function drawGrid(){
      for (var x = 0; x <= windowDimensions.width * 2; x += gridSize) {
          context.moveTo(x, 0);
          context.lineTo(x, windowDimensions.height * 2);
      }

      for (var y = 0; y <= windowDimensions.height * 2; y += gridSize) {
        context.moveTo(0, y);
        context.lineTo(windowDimensions.width * 2, y);
    }

      context.strokeStyle = "#ccc";
      context.stroke();
    }
    
    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  })

  let handleMouseMove = (e: any) => {
    const { clientX: x, clientY: y } = e;
    setCoords({ x, y });
  }

  return (
    <canvas ref={canvasRef} onMouseMove={handleMouseMove}>
    </canvas>
  )
}

export default Canvas;