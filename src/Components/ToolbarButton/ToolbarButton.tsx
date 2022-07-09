import './ToolbarButton.scss';

export interface ToolbarButtonProps {
  name: string;
  imgSrc: string;
  selected: boolean;
  onClick: any;
}

export const ToolbarButton = (props: ToolbarButtonProps) => {
  const { name, imgSrc, selected, onClick } = props;

  return (
    <div className={`ToolbarButton${selected ? '--selected' : ''}`} onClick={onClick}>
      <p>{name}</p>
    </div>
  );
}

export default ToolbarButton;