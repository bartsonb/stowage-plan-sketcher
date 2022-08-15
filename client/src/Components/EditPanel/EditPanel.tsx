import { cargo } from "../../Components/Cargo/Cargo";
import Box from "../Box/Box";
import "./EditPanel.scss";

export interface EditPanelProps {
    cargo: cargo[];
    alignCargo: any;
    deleteCargo: any;
    editCargo: any;
}

export const EditPanel = (props: EditPanelProps) => {
    const { cargo } = props;

    const toggleHazardous = ({ target }: any, cargoIndex: number): void => {
        props.editCargo(cargoIndex, 'hazardous', target.checked);
    }

    let selectedCargoList = [];
    let isCargoSelected = false;

    if (cargo.length > 0) {
        // Get all cargos that are selected.
        selectedCargoList = cargo
            .filter((el) => el.selected)
            .map((el, index) => (
                <div className="EditPanel__Cargo__Element" key={index}>
                    <p>{el.cargoType} ({el.cargoIndex})</p>
                    <input 
                        onChange={event => {toggleHazardous(event, el.cargoIndex)}}
                        type="checkbox" 
                        checked={el.hazardous} />
                </div>
            ));

        isCargoSelected = selectedCargoList.length > 0;
    }

    return (
        <Box cssClass="EditPanel" title="Editing">
            <p className="Box__Content__Category">
                Selected Cargo ({selectedCargoList.length})
            </p>
            <div className="EditPanel__Cargo">{selectedCargoList}</div>

            <p className="Box__Content__Category">Alignment</p>
            <div className="EditPanel__Buttons EditPanel__Buttons__Alignment">
                <button
                    className="EditPanel__Buttons__Alignment EditPanel__Buttons__Alignment--left"
                    disabled={!isCargoSelected}
                    onClick={() => {
                        props.alignCargo("left");
                    }}
                >
                </button>
                <button
                    className="EditPanel__Buttons__Alignment EditPanel__Buttons__Alignment--top"
                    disabled={!isCargoSelected}
                    onClick={() => {
                        props.alignCargo("top");
                    }}
                >
                </button>
                <button
                    className="EditPanel__Buttons__Alignment EditPanel__Buttons__Alignment--right"
                    disabled={!isCargoSelected}
                    onClick={() => {
                        props.alignCargo("right");
                    }}
                >
                </button>
                <button
                    className="EditPanel__Buttons__Alignment EditPanel__Buttons__Alignment--bottom"
                    disabled={!isCargoSelected}
                    onClick={() => {
                        props.alignCargo("bottom");
                    }}
                >
                </button>
            </div>

            <p className="Box__Content__Category">Organization</p>
            <div className="EditPanel__Buttons EditPanel__Buttons__Organization">
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
