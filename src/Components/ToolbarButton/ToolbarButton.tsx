import "./ToolbarButton.scss";

export interface ToolbarButtonProps {
    name: string;
    imgSrc: string;
    selected: boolean;
    onClick: any;
    shortcutButton: string;
}

export const ToolbarButton = (props: ToolbarButtonProps) => {
    const { name, imgSrc, selected, onClick, shortcutButton } = props;

    return (
        <div
            className={`ToolbarButton ${selected ? "ToolbarButton--selected" : ""}`}
            onClick={onClick}
        >
            <div className="ToolbarButton__Image">
                <img src={imgSrc} alt={name} />
            </div>
            <div className="ToolbarButton__Text">
                <p className="ToolbarButton__Text__Name">{name}</p>
                <p className="ToolbarButton__Text__Shortcut">{shortcutButton}</p>
            </div>
        </div>
    );
};

export default ToolbarButton;
