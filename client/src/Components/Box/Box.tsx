import React from "react";
import Draggable from "react-draggable";
import "./Box.scss";

import dragIcon from '../../Assets/Icons/drag.svg';

export type BoxSizing = {
    x: number;
    y: number;
    width: number | string;
    height: number | string;
};

export interface BoxProps {
    title?: string;
    children?: any;
    cssClass: string;
    sizing?: BoxSizing;
}

export const Box = (props: BoxProps) => {
    const { title, children, cssClass, sizing } = props;
    const boxRef = React.useRef(null);

    // Using Object: Sizing to adjust the box width and height
    // and place it with absolute positioning.
    let styles = null;
    if (sizing) {
        styles = {
            width: sizing.width,
            height: sizing.height,
            left: sizing.x,
            top: sizing.y,
        };
    }

    return (
        <Draggable
            handle=".Box__Handle"
            defaultClassName="Draggable"
            defaultClassNameDragged="Draggable--Dragged"
            defaultClassNameDragging="Box--Dragging"
            nodeRef={boxRef}>
            <div 
                className={"Box"} 
                style={styles}
                ref={boxRef}>
                <div className="Box__Handle">
                    <img className="Box__Handle__Icon" src={dragIcon} alt="" />
                    <p className="Box__Handle__Title">{title}</p>
                    <img className="Box__Handle__Action" src="" alt="" />
                </div>
                <div className={`Box__Content ` + cssClass}>{children}</div>
            </div>
        </Draggable>
    );
};

export default Box;
