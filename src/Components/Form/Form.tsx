import './Form.scss';

export interface FormProps {
    children?: any;
    handleSubmit: any;
}

export const Form = (props: FormProps) => {
    return (
        <form className='Form' onSubmit={event => { props.handleSubmit(event) }}>
            {props.children}
        </form>
    )
}

export default Form;