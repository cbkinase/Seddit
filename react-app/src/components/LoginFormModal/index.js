import React, { useEffect, useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [validationErrors, setValidationErrors] = useState({});
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        const errors = {};
        if (credential.length < 4) {
            errors.credential =
                "Email must be at least 4 characters";
        }
        if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {
            setSubmitDisabled(false);
        } else setSubmitDisabled(true);
    }, [credential, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const data = await dispatch(login(credential, password ))
        if (data) setErrors(data)
        else closeModal()
    };

    const handleDemoLogin = async (e) => {
        e.preventDefault();
        await dispatch(login("demo@aa.io", "password"))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
    };

    return (
        <div className="login-container">
            <h1 id="title">Log In</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <ul>
                    {Object.values(errors).map((error, idx) => (
                        <li className="errors" key={idx}>
                            {error}
                        </li>
                    ))}
                </ul>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            type="text"
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
                            className="input-field"
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
                    className="decorated-button button-needs-adjustment alt-color-button"
                    disabled={submitDisabled}
                    id="submit"
                    type="submit"
                >
                    Log In
                </button>
                <button
                    className="decorated-button button-needs-adjustment"
                    onClick={handleDemoLogin}
                    id="demo"
                >
                    Demo User
                </button>
            </form>
        </div>
    );
}

export default LoginFormModal;
