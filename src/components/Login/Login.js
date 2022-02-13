import React, {useState, useEffect, useReducer, useContext, useRef} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
    if ("USER_INPUT" === action.type) {
        return {
            value: action.val,
            isValid: action.val.includes('@')
        }
    }
    if ('INPUT_BLUR' === action.type) {
        return {
            value: state.value,
            isValid: state.value.includes('@')
        }
    }
    return {
        value: '',
        isValid: false
    }
}

const passwordReducer = (state, action) => {
    if ('USER_INPUT' === action.type) {
        return {
            value: action.val,
            isValid: action.val.trim().length > 6
        }

    }

    if ('INPUT_BLUR' === action.type) {
        return {
            value: state.value,
            isValid: state.value.trim().length > 6
        }
    }


    return {value: '', isValid: false}

}

const Login = () => {
    const ctx = useContext(AuthContext);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState();
    // const [enteredPassword, setEnteredPassword] = useState('');
    // const [passwordIsValid, setPasswordIsValid] = useState();
    const [formIsValid, setFormIsValid] = useState(false);
    const [emailState, dispatchEmail] =
        useReducer(emailReducer, {value: '', isValid: null});
    const [passwordState, dispatchPassword] =
        useReducer(passwordReducer, {value: '', isValid: null});


    const {isValid: emailIsValid} = emailState;
    const {isValid: passwordIsValid} = passwordState;


    useEffect(() => {
        const identifier = setTimeout(() => {
            console.log('use effect called');
            setFormIsValid(
                emailIsValid && passwordIsValid
            );
        }, 500)

        return () => {
            clearTimeout(identifier)
            console.log("CLEANUP")
        }

    }, [emailIsValid, passwordIsValid]);

    const emailChangeHandler = (event) => {
        // setEnteredEmail(event.target.value);
        dispatchEmail({type: 'USER_INPUT', val: event.target.value});
        // setFormIsValid(
        //     event.target.value.includes('@') && passwordState.isValid
        // );

    };

    const passwordChangeHandler = (event) => {
        // setEnteredPassword(event.target.value);
        dispatchPassword({type: "USER_INPUT", val: event.target.value});
        // setFormIsValid(
        //     emailState.isValid && event.target.value.trim().length > 6
        // );


    };

    const validateEmailHandler = () => {
        // setEmailIsValid(enteredEmail.includes('@'));
        dispatchEmail({type: 'INPUT_BLUR'});
    };

    const validatePasswordHandler = () => {
        // setPasswordIsValid(enteredPassword.trim().length > 6);
        dispatchPassword({type: "INPUT_BLUR"})
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            ctx.onLogin(emailState.value, passwordState.value);
        } else if (!emailIsValid) {
            emailInputRef.current.focus()
        } else {
            passwordInputRef.current.focus()

        }
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    ref={emailInputRef}
                    id="email"
                    label="電子郵件"
                    type="email"
                    value={emailState.value}
                    isValid={emailState.isValid}
                    onChange={emailChangeHandler}
                    onBlur={validateEmailHandler}
                />
                <Input
                    ref={passwordInputRef}
                    id="password"
                    label="密碼"
                    type="password"
                    value={passwordState.value}
                    isValid={passwordState.isValid}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                />
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
