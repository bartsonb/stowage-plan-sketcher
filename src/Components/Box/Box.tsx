import './Box.scss';

export interface BoxProps {
    children?: any;
    cssClass: string;
}

export const Box = (props: BoxProps) => {
    
    return (
        <div className={'Box ' + props.cssClass}>
            <div className="Box__Handle"></div>
            <div className="Box__Content">{props.children}</div>
        </div>
    )
}

export default Box;