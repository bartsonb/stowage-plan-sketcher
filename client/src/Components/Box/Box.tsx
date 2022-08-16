import React, { CSSProperties } from "react";
import Draggable from "react-draggable";
import "./Box.scss";

import dragIcon from '../../Assets/Icons/drag.svg';

export interface BoxProps {
    title?: string;
    children?: any;
    cssClass?: string;
    sizing?: CSSProperties;
    hide?: boolean;
}

export const Box = (props: BoxProps) => {
    const { title, children, cssClass, hide } = props;
    const boxRef = React.useRef(null);

    // Default sizing object
    let sizing: CSSProperties = { display: hide ? "none" : "flex" };

    // Add css properties from props
    if (props.sizing) sizing = { ...sizing, ...props.sizing }

    return (
        <Draggable
            handle=".Box__Handle"
            defaultClassName="Draggable"
            defaultClassNameDragged="Draggable--Dragged"
            defaultClassNameDragging="Box--Dragging"
            nodeRef={boxRef}>

            <div 
                className={"Box"} 
                style={sizing}
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
}

export default Box;
