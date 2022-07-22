import './Diffuser.scss';

export interface DiffuserProps {
    children?: any;
    show: boolean;
}

export const Diffuser = (props: DiffuserProps) => {
    const { children, show } = props;

    if (show) {
        return (
            <div className="Diffuser">
                {children}
            </div>
        )
    } else {
        return;
    }
}

export default Diffuser;