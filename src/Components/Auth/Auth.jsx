import React, { useState } from 'react'
import styles from '../Auth/Auth.module.css'
import close from '../../assets/Home/close.png'
import eye from '../../assets/Home/eye.png'
import { LoginUser, RegisterUser } from '../../APIs/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Auth({ isOpen, onClose, modalVal, onLoginSuccess }) {
    const [userData, setUserData] = useState({
        username: "",
        password: "",
    });

    const [errorOccurred, setErrorOccurred] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        setErrorOccurred(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.username.trim() || !userData.password.trim()) {
            setErrorOccurred(true);
            setErrorMessage("Please fill in all fields properly");
        }

        if (!errorOccurred) {
            if (modalVal === "Register") {
                const response = await RegisterUser({ ...userData });
                if (response && response.success) {
                    onClose();
                    toast.success(response.message);
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("owner", response.id)
                    localStorage.setItem("userName", response.username);
                    onLoginSuccess(response.id);
                }
                else {
                    toast.error(response.error)
                }
            }
            else if (modalVal === "Login") {
                const response = await LoginUser({ ...userData });
                if (response && response.success) {
                    onClose();
                    toast.success(response.message);
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("owner", response.id)
                    localStorage.setItem("userName", response.username);
                    onLoginSuccess(response.id);
                }
                else {
                    toast.error(response.error)
                }
            }
        }
    };

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <>
            {isOpen && (
                <div className={styles.modal}>
                    <div className={styles.overlay}></div>
                    <div className={styles.modal_content}>
                        <img src={close} alt="" id={styles.close_btn} onClick={onClose} />
                        <h3 id={styles.heading}>{modalVal} to SwipTory</h3>
                        <form action="">
                            <div className={styles.username_div}>
                                <label htmlFor="username">Username</label>
                                <input type="text" id='username'
                                    name='username'
                                    placeholder='Enter username'
                                    className={styles.input}
                                    value={userData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.password_div}>
                                <label htmlFor="password">Password</label>
                                <input type={passwordShown ? "text" : "password"}
                                    id='password'
                                    name='password'
                                    placeholder='Enter password'
                                    className={styles.input}
                                    value={userData.password}
                                    onChange={handleChange}
                                />
                                <img src={eye} alt="" id={styles.eye_img} onClick={togglePasswordVisiblity} />
                            </div>
                        </form>

                        {errorOccurred && <p className={styles.error}>{errorMessage}</p>}

                        <button className={styles.register_btn} onClick={(e) => handleSubmit(e)}>{modalVal}</button>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default Auth