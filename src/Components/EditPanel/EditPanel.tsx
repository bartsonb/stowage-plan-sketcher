import { useState } from "react";
import { cargo } from "../../Pages/Sketcher/Sketcher";
import "./EditPanel.scss";

export interface EditPanelProps {
    cargo: cargo[];
    alignCargo: any;
    deleteCargo: any;
    deselectCargo: any;
}

export const EditPanel = (props: EditPanelProps) => {
    const { cargo } = props;

    const selectedCargoList = cargo
        .filter(el => el.selected)
        .map((el, index) => <p key={index}>{el.cargoType} ({el.cargoIndex})</p>);

    const open = selectedCargoList.length > 0;

    return (
        <div
            className="EditPanel"
            style={{ display: `${open ? "flex" : "none"}` }}
        >
            <div className="EditPanel__Cargo">
                {selectedCargoList}
            </div>

            <div className="EditPanel__Buttons">
                <button onClick={() => {props.alignCargo('vertical')}}>Align Vertically</button>
                <button className="EditPanel__Buttons EditPanel__Buttons--edit">Edit</button>
                <button onClick={props.deselectCargo} className="EditPanel__Buttons EditPanel__Buttons--deselect">De-Select</button>
                <button onClick={props.deleteCargo} className="EditPanel__Buttons EditPanel__Buttons--delete">Delete</button>
            </div>
        </div>
    );
};

export default EditPanel;
