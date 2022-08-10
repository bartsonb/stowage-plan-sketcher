import './Cargo.scss';

export enum cargoType {
    Container = 'container',
    Box = 'box',
    Pipes = 'pipes'
}

export const cargoInfo = {
    container: {
        abbreviation: 'cn', 
        size: ["80px", "40px"],
        shortcutKey: 'c'
    }, 
    box: {
        abbreviation: 'bx', 
        size: ["40px", "40px"],
        shortcutKey: 'b'
    }
}

export const cargoTypeExists = (value) => Object.values(cargoType).includes(value);

export type cargo = {
    coords: {
        x: number,
        y: number
    };
    deckIndex: number;
    cargoIndex: number;
    cargoType: string;
    selected: boolean;
    hazardous: boolean;
}

export interface CargoProps {
    coords: any;
    type: string;
    preview: boolean;
    selected?: boolean;
    hazardous?: boolean;
    index?: number;
    handleClick?: any;
}

export const Cargo = (props: CargoProps) => {
    const [ width, height ] = cargoInfo[props.type].size;

    // Return a simplified version of the cargo, if the preview param is true.
    if (props.preview) {
        return (
            <div 
                className={`Cargo Cargo__Preview`}
                style={{width: width, height: height, top: props.coords.y, left: props.coords.x}}>
            </div> 
        )
    } else {
        return (
            <div 
                className={`Cargo Cargo__${props.type} ${props.selected ? 'Cargo--selected' : ''} ${props.hazardous ? 'Cargo--hazardous' : ''}`}
                style={{width: width, height: height, top: props.coords.y, left: props.coords.x}}
                onClick={(event) => { props.handleClick(event, props.index) }}>
    
                <div className="Cargo__Description" style={{ display: props.preview ? 'hidden' : 'flex'}}>
                    <p className={"Cargo__Description__Element Cargo__Description__Element--index"}>{props.index}</p>
                    <p className={"Cargo__Description__Element Cargo__Description__Element--type"}>
                        {props.type} {props.hazardous ? '(H)' : ''}
                    </p>
                </div>
            </div> 
        )
    }
}

export default Cargo;