import ToolbarButton from "../ToolbarButton/ToolbarButton";
import Box from "../Box/Box";
import "./Toolbar.scss";

export interface ToolbarProps {
    selectedTool: string;
    updateTool: any;
}

export const Toolbar = (props: ToolbarProps) => {
    const { selectedTool, updateTool } = props;

    let handleOnClick = (toolName: string) => updateTool(toolName);

    return (
        <Box cssClass="Toolbar" title="Tools">
            <p className="Toolbar__Category">Organization</p>
            <ToolbarButton
                onClick={() => {handleOnClick('select')}}
                name={'Select'}
                imgSrc={'http://via.placeholder.com/10x10'}
                selected={selectedTool == 'select' ? true : false}
            />
    
            <p className="Toolbar__Category">Add</p>
            <ToolbarButton
                onClick={() => {handleOnClick('container')}}
                name={'Container'}
                imgSrc={'http://via.placeholder.com/10x10'}
                selected={selectedTool == 'container' ? true : false}
            />

            <ToolbarButton
                onClick={() => {handleOnClick('box')}}
                name={'Box'}
                imgSrc={'http://via.placeholder.com/10x10'}
                selected={selectedTool == 'box' ? true : false}
            />
        </Box>
    );
};

export default Toolbar;
