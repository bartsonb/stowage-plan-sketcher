import { useState } from "react";
import "./EditPanel.scss";

export interface EditPanelProps {
    cargo: any[];
}

export const EditPanel = (props: EditPanelProps) => {
    const { cargo } = props;

    const handleClick = (e): void => {};

    const selectedCargoList = cargo
        .map((el, index) => {
            el.index = index;
            return el;
        })
        .filter(el => el.selected)
        .map((el, index) => <p key={index}>{el.cargoType} ({el.index})</p>);
    const open = selectedCargoList.length > 0;

    console.log(selectedCargoList);

    return (
        <div
            className="EditPanel"
            style={{ display: `${open ? "flex" : "none"}` }}
        >
            <div className="EditPanel__Cargo">
                {selectedCargoList}
            </div>

            <div className="EditPanel__Buttons">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>
    );
};

export default EditPanel;
