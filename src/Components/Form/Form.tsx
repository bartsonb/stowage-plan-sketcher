import './Form.scss';

export const Form = () => {
    return (
        <form className='Form'>
            <input type="text" placeholder="E-Mail" />
            <input type="password" placeholder="Password" name="" id="" />
            
            <input type="submit" value="Login" />
        </form>
    )
}

export default Form;