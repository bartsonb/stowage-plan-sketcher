import './Form.scss';

export interface FormProps {
    children?: any;
}

export const Form = (props: FormProps) => {
    return (
        <form className='Form'>
            <input type="text" placeholder="E-Mail" />
            <input type="password" placeholder="Password" name="" id="" />
            
            <input type="submit" value="Login" />
        </form>
    )
}

export default Form;