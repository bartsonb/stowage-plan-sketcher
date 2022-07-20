import './Cargo.scss';

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
    const getSize = (cargoType: string) => {
        switch(cargoType) {
            case 'container':
                return ['80px', '40px'];
            case 'box': 
                return ['40px', '40px'];

            default: 
                return ['40px', '40px'];
        }
    }

    const [ width, height ] = getSize(props.type);

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