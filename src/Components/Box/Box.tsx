import './Box.scss';

export type BoxSizing = {
    x: number;
    y: number;
    width: number;
    height: number
}

export interface BoxProps {
    title?: string;
    children?: any;
    cssClass: string;
    sizing?: BoxSizing;
}

export const Box = (props: BoxProps) => {
    const { title, children, cssClass, sizing } = props;
    let styles = null;

    if (sizing) {
        styles = {
            width: sizing.width,
            height: sizing.height,
            left: sizing.x,
            top: sizing.y
        }
    }

    return (
        <div className={'Box ' + cssClass} style={styles}>
            <div className="Box__Handle">
                <img className="Box__Handle__Icon" src="" alt="" />
                <p className="Box__Handle__Title">{title}</p>
                <img className="Box__Handle__Action" src="" alt="" />
            </div>
            <div className={`Box__Content`}>{children}</div>
        </div>
    )
}

export default Box;