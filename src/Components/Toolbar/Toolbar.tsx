import ToolbarButton from "../ToolbarButton/ToolbarButton";

import './Toolbar.scss';

export interface ToolbarProps {
  selectedTool: string;
  updateTool: any;
}

export const Toolbar = (props: ToolbarProps) => {
  const { selectedTool, updateTool } = props;

  let handleOnClick = (e) => {
    let { target } = e;
    
    updateTool(target.innerHTML);
  }

  const buttons = [
    { name: 'select', imgSrc: '' }, 
    { name: 'container', imgSrc: '' }, 
    { name: 'box', imgSrc: '' }
  ];

  const buttonElements = buttons.map((el, index) => {
    return <ToolbarButton 
      onClick={handleOnClick}
      key={index}
      name={el.name} 
      imgSrc={el.imgSrc} 
      selected={selectedTool == el.name ? true : false} />
  })



  return (
    <div className="Toolbar">
      {buttonElements}
    </div>
  );
}

export default Toolbar;