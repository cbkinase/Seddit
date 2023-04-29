import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import { useHistory } from "react-router-dom";

function SignupFormModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    // const [hasSubmitted, setHasSubmitted] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    // const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const signUpDependencies = [email, username, password, confirmPassword];
        const errors = {};
        if (signUpDependencies.some((formInput) => formInput.length === 0))
            errors.empty = "Nonzero input length required";
        if (username.length < 4)
            errors.username = "Username must be at least 4 characters";
        if (password.length < 6)
            errors.password = "Password must be at least 6 characters";
        // if (password !== confirmPassword)
        //     errors.confirmation = "Passwords do not match";
        // setValidationErrors(errors);
        // setErrors(Object.values(errors))

        if (Object.keys(errors).length === 0) setSubmitDisabled(false);
        else setSubmitDisabled(true);
    }, [email, username, password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            const data = await dispatch(signUp(username, email, password))

            if (data) {
                setErrors(Object.values(data.errors));
                return;
            }

            closeModal();

        }
        return setErrors([
            "Confirm Password field must be the same as the Password field",
        ]);
    };

    return (
        <div className="modal">

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
                className="modal-header"
            >
                <h1
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "26px",
                    }}
                >
                    Sign Up
                </h1>
                <ul>
                    {Object.values(errors).map((error, idx) => (
                        <li className="errors" key={idx}>
                            {error}
                        </li>
                    ))}
                </ul>

                <div
                    style={{ marginTop: "13px", marginBottom: "0px" }}
                    className="footer-signup-login"
                >
                    <p className="toc-signup">
                        By continuing, you agree to our{" "}
                        <span
                            className="toc-links"
                            onClick={(e) => {
                                closeModal();
                                history.push("/agreement");
                            }}
                        >
                            User Agreement
                        </span>{" "}
                        and{" "}
                        <span
                            className="toc-links"
                            onClick={(e) => {
                                closeModal();
                                history.push("/policy");
                            }}
                        >
                            Privacy Policy
                        </span>
                        .
                    </p>
                </div>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>
                        <input
                            style={{ width: "435px", borderRadius: "15px" }}
                            className="create-comm-input"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    {/* {hasSubmitted && errors.email && (
                        <p className="errors">*{errors.email}</p>
                    )} */}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            style={{ width: "435px", borderRadius: "15px" }}
                            className="create-comm-input"
                            placeholder="Username - 4 characters minimum"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    {/* {hasSubmitted && errors.username && (
                        <p className="errors">*{errors.username}</p>
                    )} */}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            style={{ width: "435px", borderRadius: "15px" }}
                            className="create-comm-input"
                            placeholder="Password - 6 characters minimum"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {/* {hasSubmitted && errors.password && (
                        <p className="errors">*{errors.password}</p>
                    )} */}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            style={{ width: "435px", borderRadius: "15px" }}
                            className="create-comm-input"
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button
                    className="button-main"
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        marginLeft: "2px",
                        borderRadius: "15px",
                        height: "40px",
                        marginBottom: "10px",
                    }}
                    disabled={submitDisabled}
                    id="submit"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
            <div className="footer-signup-login">
                <p>
                    Already a redditor?
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                        className="redirect-signup-login"
                    />
                </p>
            </div>
        </div>
    );
}

export default SignupFormModal;
