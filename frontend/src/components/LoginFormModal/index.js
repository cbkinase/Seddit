import React, { useEffect, useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    // const [validationErrors, setValidationErrors] = useState({});
    // const [hasSubmitted, setHasSubmitted] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        const errors = {};
        if (credential.length < 4) {
            errors.credential = "Email must be at least 4 characters";
        }
        if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        // setValidationErrors(errors);
        // setErrors(Object.values(errors))

        if (Object.keys(errors).length === 0) {
            setSubmitDisabled(false);
        } else setSubmitDisabled(true);
    }, [credential, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setHasSubmitted(true)
        setErrors([]);
        const data = await dispatch(login(credential, password));
        if (data) setErrors(data);
        else closeModal();
    };

    const handleDemoLogin = async (e) => {
        e.preventDefault();
        const data = await dispatch(login("demo@aa.io", "password"));
        if (data) setErrors(data);
        else closeModal();
    };

    // const handleRegistration = (e) => {};

    return (
        <div className="modal">
            <div
                style={{ display: "flex", justifyContent: "center" }}
                className="modal-header"
            >
                <h1
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "26px",
                    }}
                >
                    Welcome back!
                </h1>

            </div>
            <ul>
                    {Object.values(errors).map((error, idx) => (
                        <li style={{textAlign:"center"}} className="errors" key={idx}>
                            {error}
                        </li>
                    ))}
                </ul>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>
                        <input
                            style={{ width: "435px", borderRadius: "15px" }}
                            className="create-comm-input"
                            type="email"
                            value={credential}
                            placeholder="Email"
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </label>
                    {/* {validationErrors.credential && (
                        <p className="errors">*{validationErrors.credential}</p>
                    )} */}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            style={{ width: "435px", borderRadius: "15px" }}
                            className="create-comm-input"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {/* {validationErrors.password && (
                        <p className="errors">*{validationErrors.password}</p>
                    )} */}
                </div>
                <button
                    className="button-main"
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        marginRight: "6px",
                        borderRadius: "15px",
                        height: "40px",
                        marginBottom: "-5px",
                    }}
                    disabled={submitDisabled}
                    id="submit"
                    type="submit"
                >
                    Log In
                </button>
                <button
                    className="button-alt"
                    onClick={handleDemoLogin}
                    style={{
                        width: "100%",
                        borderRadius: "15px",
                        height: "40px",
                    }}
                    id="demo"
                >
                    Demo User
                </button>
            </form>
            <div className="footer-signup-login">
                <p>
                    New to Reddit?
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                        className="redirect-signup-login"
                    />
                </p>
            </div>
        </div>
    );
}

export default LoginFormModal;
