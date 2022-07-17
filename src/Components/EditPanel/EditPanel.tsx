import { useState } from "react";
import { cargo } from "../../Pages/Sketcher/Sketcher";
import Box from "../Box/Box";
import "./EditPanel.scss";

export interface EditPanelProps {
    cargo: cargo[];
    alignCargo: any;
    deleteCargo: any;
    deselectCargo: any;
}

export const EditPanel = (props: EditPanelProps) => {
    const { cargo } = props;

    let selectedCargoList = [];
    let isCargoSelected = false;

    if (cargo.length > 0) {
        // Get all cargos that are selected.
        selectedCargoList = cargo
            .filter((el) => el.selected)
            .map((el, index) => (
                <div className="EditPanel__Cargo__Element" key={index}>
                    <p>{el.cargoType} ({el.cargoIndex})</p>
                    <input type="checkbox" checked={el.hazardous} />
                </div>
            ));

        isCargoSelected = selectedCargoList.length > 0;
    }

    return (
        <Box cssClass="EditPanel" title="Editing">
            <p className="EditPanel__Category">
                Selected Cargo ({selectedCargoList.length})
            </p>
            <div className="EditPanel__Cargo">{selectedCargoList}</div>

            <p className="EditPanel__Category">Alignment</p>
            <div className="EditPanel__Buttons EditPanel__Buttons__Alignment">
                <button
                    className="EditPanel__Buttons__Alignment EditPanel__Buttons__Alignment--left"
                    disabled={!isCargoSelected}
                    onClick={() => {
                        props.alignCargo("vertical");
                    }}
                >
                    Left
                </button>
            </div>

            <p className="EditPanel__Category">Organization</p>
            <div className="EditPanel__Buttons EditPanel__Buttons__Organization">
                <button 
                    className="EditPanel__Buttons__Organization EditPanel__Buttons__Organization--edit"
                    disabled={selectedCargoList.length !== 1}>
                    Edit
                </button>
                <button
                    onClick={props.deleteCargo}
                    className="EditPanel__Buttons__Organization EditPanel__Buttons__Organization--delete"
                    disabled={!isCargoSelected}
                >
                    Delete
                </button>
            </div>
        </Box>
    );
};

export default EditPanel;
