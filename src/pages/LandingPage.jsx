import React, { useEffect, useState } from "react";
import axios from "axios";

import tubelight from "../assets/tubelight.svg";
import line from "../assets/line.svg";

import classes from "./LandingPage.module.css";

function LandingPage() {
    const [code, setCode] = useState("No code yet");

    useEffect(() => {
        axios
            .get(
                "https://kpe0uukqaa.execute-api.ap-south-1.amazonaws.com/staging/generateTvCode"
            )
            .then((response) => {
                setCode(response.data.sixDigitCode);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        console.log("code stored in variable: " + code);
    }, [code]);

    const callApi = () => {
        axios({
            method: "POST",
            url: "https://kpe0uukqaa.execute-api.ap-south-1.amazonaws.com/staging/tvHeartbeat",
            data: { code: code },
        })
            .then((response) => {
                if (response.data.statusCode === 200) {
                    console.log("Account Confirmed: ", response.data.sessionId);
                    localStorage.setItem("newLogin", "true");
                    localStorage.setItem("authStatus", "true");
                    // configureLogin()
                } else if (response.data.statusCode === 202) {
                    console.log("Confirmation Pending");
                    setTimeout(callApi, 2000);
                }
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    // const configureLogin = async () => {

    // }

    if (code !== "No code yet") {
        callApi();
    }

    return (
        <div>
            <div className={classes.logoContainer}>
                <img
                    className={classes.logo}
                    src={tubelight}
                    alt="tubelight logo"
                ></img>
            </div>
            <div className={classes.midSection}>
                <h1 className={classes.text}>
                    <p className={classes.textHeading}>
                        On the web <br></br>
                    </p>
                    1. Go to tubelight-bd7ed.web.app<br></br>2. Sign in or
                    create an account
                    <br></br>3. Go to Link Tv
                    <br></br>
                    4. Enter the following code:
                </h1>
                <div className={classes.midCol}>
                    <img className={classes.line} src={line} alt="line"></img>
                    <p className={classes.or}>OR</p>
                    <img className={classes.line} src={line} alt="line"></img>
                </div>
                <h1 className={classes.text}>
                    <p className={classes.textHeading}>On the mobile app</p>
                    1. Open the mobile app <br></br>2. Sign in or create an
                    account
                    <br></br>3. Go to Link Tv
                    <br></br>4. Enter the following code:
                </h1>
            </div>
            <div className={classes.codeContainer}>
                <h3 className={classes.code}>{code}</h3>
            </div>
        </div>
    );
}

export default LandingPage;
