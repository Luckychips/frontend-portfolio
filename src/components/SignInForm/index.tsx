import React from 'react'
import './styles.css'

const SignInForm = () => {
    return (
        <section id="sign-in-form-container">
            <form action='/'>
                <input type="text" placeholder="username" className="p-2" />
                <input type="password" placeholder="password" className="p-2 mt-6" />
                <input type="submit" value="SIGN IN" className="p-2 mt-6" />
            </form>
        </section>
    )
}

export default SignInForm
