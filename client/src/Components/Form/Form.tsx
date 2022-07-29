import './Form.scss';

export interface FormProps {
    children?: any;
    handleSubmit: any;
}

export const Form = (props: FormProps) => {
    
    const formSubmitted = (event: any): any => {
        event.preventDefault();
        props.handleSubmit(event);
    }

    return (
        <form className='Form' onSubmit={formSubmitted}>
            {props.children}
        </form>
    )
}

export default Form;