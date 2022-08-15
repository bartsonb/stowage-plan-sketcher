import './Cargo.scss';

export enum cargoType {
    Container = 'container',
    Box = 'box'
}

export const cargoInfo = {
    container: {
        abbreviation: 'cn', 
        size: ["80px", "40px"],
        hotkey: 'c'
    }, 
    box: {
        abbreviation: 'bx', 
        size: ["40px", "40px"],
        hotkey: 'b'
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
    handleClick?(event: any, cargoIndex: number): any;
}

export const Cargo = (props: CargoProps) => {
    const { index, type, selected, hazardous, coords, preview, handleClick } = props;
    const [ width, height ] = cargoInfo[props.type].size;

    // Return a simplified version of the cargo, if the preview param is true.
    if (preview) {
        return (
            <div 
                className={`Cargo Cargo__Preview`}
                style={{width, height, top: coords.y, left: coords.x}}>
            </div> 
        )
    } else {
        return (
            <div 
                className={`Cargo Cargo__${type} ${selected ? 'Cargo--selected' : ''} ${hazardous ? 'Cargo--hazardous' : ''}`}
                data-index={index}
                style={{width, height, top: coords.y, left: coords.x}}
                onClick={(event) => { handleClick(event, index) }}>
    
                <div className="Cargo__Description" data-index={index}>
                    <p className={"Cargo__Description__Element Cargo__Description__Element--index"} data-index={index}>{index}</p>
                    <p className={"Cargo__Description__Element Cargo__Description__Element--type"} data-index={index}>
                        {type} {hazardous ? '(H)' : ''}
                    </p>
                </div>
            </div> 
        )
    }
}

export default Cargo;