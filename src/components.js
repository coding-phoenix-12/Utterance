import React, { useEffect } from "react"
import { useState, useRef } from "react";
import { storage } from "./firebase"
import { ref, getDownloadURL } from "firebase/storage";
import { CircularProgress } from "@mui/material";
import {auth , provider, database}  from './firebase';
import Button from '@mui/material/Button';
import sha1 from 'sha1';




const Login = () => {
  
    // Sign in with google
    const signin = () => {
        var btn = document.getElementById('LoginBtn');
        btn.innerHTML = "Please Wait";
        btn.ariaDisabled = true;
        auth.signInWithPopup(provider)
        .catch(alert);
    }
      
    return (
        <div>  
                 <Button id="LoginBtn" variant="contained" onClick={signin}>Sign In with Google</Button>
        </div>
    );
}


function Done() {
    return (
        <>
            < hr />
            <h3>Thank you for your response </h3>
        </>
    )
}


function LoadQuestion(props) {

    const [url, setUrl] = React.useState()

    const audioRef = useRef();

    


    useEffect(() => {

        function getUrl(filename) {
            getDownloadURL(ref(storage, filename))
                .then((url) => {
                    setUrl(url)
                });
        }

        getUrl(props.audio)

        console.log("loadquestion id", props.index)

    }, [props.audio])
    

    const handlePlay = (event) => {
        audioRef.current.play();
       
      }

    const handleEnded = (event) => {
        props.handleEnded(true);
    }

 return (
    <div> 
        {!url && <CircularProgress />}
        {url && <div className="audio-wrapper"><audio className="audio-player" src={url}  ref={audioRef} onEnded={handleEnded}></audio></div> } 
        <Button variant="contained" onClick={handlePlay} >Play audio </Button>

        <p>
            {props.text}
        </p>


        { props.ended && 
        <div>


        <p>
                <b>
                Do you understand what is being spoken in the audio?

                </b>
        </p>
        <p>
            <label>
                <input
                    className="option-radio"  name="1" type="radio" value="Yes" onChange={props.handlechange} checked={props.inputs["1"] === "Yes"} required />
                    Yes

            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="1" type="radio" value="No" onChange={props.handlechange} checked={props.inputs["1"] === "No"} required />
                    No
            </label>
        </p>

        <p>
                <b>
                Can you identify the gender of the speaker?
                </b>
        </p>
        <p>
            <label>
                <input
                    className="option-radio"  name="2" type="radio" value="Male" onChange={props.handlechange} checked={props.inputs["2"] === "Male"} required />
                    Male
            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="2" type="radio" value="Female" onChange={props.handlechange} checked={props.inputs["2"] === "Female"} required />
                    Female
            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="2" type="radio" value="Undetermined" onChange={props.handlechange} checked={props.inputs["2"] === "Undetermined"} required />
                    Can't Determine
            </label>
        </p>

        <p>
                <b>
                Does the audio exactly match the text?
                </b>
        </p>
        <p>
            <label>
                <input
                    className="option-radio"  name="3" type="radio" value="Yes" onChange={props.handlechange} checked={props.inputs["3"] === "Yes"} required />
                    Yes
            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="3" type="radio" value="No" onChange={props.handlechange} checked={props.inputs["3"] === "No"} required />
                    No
            </label>
        </p>

        { (props.q3 === "No") &&
            <div>
            <p>
                <b>
                Can it be corrected?
                </b>
        </p>
        <p>
            <label>
                <input
                    className="option-radio"  name="3-1" type="radio" value="Yes" onChange={props.handlechange} checked={props.inputs["3-1"] === "Yes"} required />
                    Yes
            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="3-1" type="radio" value="No" onChange={props.handlechange} checked={props.inputs["3-1"] === "No"} required />
                    No
            </label>
        </p>
        </div>
        
        }

        { (props.q3_1 === "Yes") &&
            <div>
                    <label>
                        <b>Corrected text please (Mandatory) : </b>
                        <input className="text-box" type="text" name="3-2" value={props.inputs["3-2"]} onChange={props.handlechange} />        
                    </label>
                                
                </div>

        
        
        }

        <p>
                <b>
                Do you hear any beep/extra speech in the audio?

                </b>
        </p>
        <p>
            <label>
                <input
                    className="option-radio"  name="4" type="radio" value="Yes_beg" onChange={props.handlechange} checked={props.inputs["4"] === "Yes_beg"} required />
                    Yes, at the beginning


            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="4" type="radio" value="Yes_end" onChange={props.handlechange} checked={props.inputs["4"] === "Yes_end"} required />
                    Yes, at the end
            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="4" type="radio" value="Yes_be" onChange={props.handlechange} checked={props.inputs["4"] === "Yes_be"} required />
                    Yes, both at begin and end

            </label>
            <br/>
            <label>
                <input
                    className="option-radio"  name="4" type="radio" value="No" onChange={props.handlechange} checked={props.inputs["4"] === "No"} required />
                    No

            </label>
        </p>
        

            


            
        </div>
  
    }
    </div>
    )
}




export { LoadQuestion, Login, Done}