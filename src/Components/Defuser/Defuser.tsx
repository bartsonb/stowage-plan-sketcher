import './Defuser.scss';

export interface DefuserProps {
    children?: any;
    show: boolean;
}

export const Defuser = (props: DefuserProps) => {
    const { children, show } = props;

    if (show) {
        return (
            <div className="Defuser">
                {children}
            </div>
        )
    } else {
        return;
    }
}

export default Defuser;