import './Cargo.scss';

export interface CargoProps {
    coords: any;
    type: string;
    preview: boolean;
    selected: boolean;
    index: number;
    handleClick: any;
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

    return (
        <div 
            className={`Cargo Cargo__${props.type} ${props.selected ? 'Cargo--selected' : ''}`}
            style={{width: width, height: height, top: props.coords.y, left: props.coords.x}}
            onClick={(event) => { props.handleClick(event, props.index) }}>

            <div className="Cargo__Description">
                <p style={{ display: props.preview ? 'hidden' : 'inline-block'}}>{Math.round(props.coords.x)}, {Math.round(props.coords.y)}</p>
                <p style={{ display: props.preview ? 'hidden' : 'inline-block'}}>{props.type} ({props.index})</p>
            </div>

        </div> 
    )
}

export default Cargo;