import ToolbarButton from "../ToolbarButton/ToolbarButton";
import Box from "../Box/Box";
import { cargoInfo, cargoTypeExists } from "../Cargo/Cargo";
import "./Toolbar.scss";

import selectImage from '../../Assets/Icons/tool-select.svg';
import containerImage from '../../Assets/Icons/tool-container.svg';
import boxImage from '../../Assets/Icons/tool-box.svg';

export interface ToolbarProps {
    selectedTool: string;
    updateTool: any;
}

export const isCargoTool = tool => cargoTypeExists(tool);
export const isSelectTool = tool => tool === 'select';

export const Toolbar = (props: ToolbarProps) => {
    const { selectedTool, updateTool } = props;
    const handleOnClick = (toolName: string) => updateTool(toolName);

    return (
        <Box cssClass="Toolbar" title="Tools">
            <p className="Toolbar__Category">Organization</p>
            <ToolbarButton
                shortcutButton="v"
                onClick={() => {handleOnClick('select')}}
                name={'Select'}
                imgSrc={selectImage}
                selected={selectedTool === 'select' ? true : false}
            />
    
            <p className="Toolbar__Category">Add</p>
            <ToolbarButton
                shortcutButton={cargoInfo['container'].shortcutKey}
                onClick={() => {handleOnClick('container')}}
                name={'Container'}
                imgSrc={containerImage}
                selected={selectedTool === 'container' ? true : false}
            />

            <ToolbarButton
                shortcutButton={cargoInfo['box'].shortcutKey}
                onClick={() => {handleOnClick('box')}}
                name={'Box'}
                imgSrc={boxImage}
                selected={selectedTool === 'box' ? true : false}
            />
        </Box>
    );
};

export default Toolbar;
