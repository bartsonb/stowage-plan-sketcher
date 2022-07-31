import "./Diffuser.scss";

export interface DiffuserProps {
    children?: any;
    show: boolean;
}

export const Diffuser = (props: DiffuserProps) => {
    const { children, show } = props;

    return <div className={`Diffuser${show ? ' Diffuser--active' : ' Diffuser--inactive'}`}>{children}</div>;
};

export default Diffuser;
