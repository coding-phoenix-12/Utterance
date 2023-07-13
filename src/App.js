import React, { useEffect, useRef } from "react";
import audio_texts from './new_utt_path.json';
import { useState } from "react";
import Button from '@mui/material/Button';
import {LoadQuestion, Login, Done} from "./components";
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, database} from './firebase';
import sha1 from 'sha1';
import {serverTimestamp, Timestamp} from 'firebase/firestore';


export default function App() {

  var shuffleSeed = require('shuffle-seed');

  const audios = audio_texts.mp3path;
  const texts = audio_texts.textpath;
  const all_ids = Object.keys(audios);
  console.log(all_ids[10])
  var group_ind = 0;



  const [allIds, setAllIds] = useState(all_ids);
  const [inputs, setInputs] = useState({});

  const [isDone, setDone] = useState(false);
  const [isEnded, setEnded] = useState(false);


  const [user] = useAuthState(auth);

  const [currInd, setInd] = useState(0);
  const [currId, setId] = useState(allIds[0]);
  const [currText, setText] = useState(texts[allIds[0]]);
  const [currAudio, setAudio] = useState(audios[allIds[0]]);
  const [q3, setQ3] = useState();
  const [q3_1, setQ3_1] = useState();

  const [loaded, setLoaded] = useState(false);

 

  const [comp, setComp] = useState(0);


  
 

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
    if (name === "3"){
      delete inputs["3-1"];
      delete inputs["3-2"];
      setQ3(value);
      setQ3_1();
    }
    else if (name === "3-1"){
      delete inputs["3-2"];
      setQ3_1(value);
    }

    console.log(inputs);
 
   
   
  }

  const handleSubmit = (event) => {
    if (user) {
      console.log("Length", Object.keys(inputs).length)

      if (((inputs["3"] === "Yes") && ( Object.keys(inputs).length === 4)) || ((inputs["3"] === "No") && (inputs["3-1"] === "Yes") && ( Object.keys(inputs).length === 6)) || ((inputs["3"] === "No") && (inputs["3-1"] === "No") && ( Object.keys(inputs).length === 5)) )  {
          setEnded(false);
          setComp(comp+1);

          database.ref(user.uid + "/data/" + currId).set({
            timestamp: Timestamp.now().toDate().toString(),
            email: user.email,
            audio: currAudio,
            ID: currId,
            data: inputs   
          }).catch(alert)



          console.log("submit ",  currInd%100)
          

          
          database.ref(user.uid + "/data").get().then((data_count) => {

          if (currInd+1 >= all_ids.length) {
            auth.signOut();
            setDone(true);
          }

          database.ref(user.uid + "/index").set(
            currInd+1
        ).catch(alert)

          setInd(currInd+1);

          
        })

          
 
        
      
      }

      else {
        alert("Please select an option for all questions")
      }
    
  }
}




  useEffect(() =>{
    if (user) {
      database.ref(user.uid).get().then((db_res) => {
        if (db_res.exists()) {
          database.ref(user.uid + "/data").get().then((data_count) => {
            console.log("Data", Object.keys(data_count.val()).length)
            setComp(Object.keys(data_count.val()).length);
            if (Object.keys(data_count.val()).length === all_ids.length) {
                setDone(true)
            }
         
          else {
          database.ref(user.uid + "/index").get().then((ind) => {
            console.log("loaded", ind.val())
            setAllIds(shuffleSeed.shuffle(allIds,user.uid));
            setInd(ind.val());
          
            }).catch(alert)
          }
        })
       
        }
        
        else {
          console.log("New user");
          setAllIds(shuffleSeed.shuffle(allIds,user.uid));
          setInd(0)
            // var group_ind = count_vals.indexOf(Math.min(...count_vals));
            database.ref(user.uid + "/index").set(0).catch(alert)
            

            
            // setLoaded(true);

        

          
          
        }
      })
      .catch((error) => {
        console.log("can't fetch");
        console.error(error);
      });
    }


  }, [user]);

  useEffect(() => {

    console.log(inputs, currInd, all_ids[currInd], all_ids[0])
    
    setId(allIds[currInd]);
    setAudio(audios[allIds[currInd]]);
    setText(texts[allIds[currInd]]);
    setInputs({});
  
    console.log(currAudio, currText)
    setLoaded(true);
  


 
    
     
 }, [currInd]);



  return (
    <>
    <div className= "heading">
        <h1>RESPIN Audio Data Validation - Bengali Test Set
        </h1>
        
    </div>

        {
          !user &&  !isDone && <Login
            user={user} 
            />
        }

      { !isDone && loaded && user && <form >
        <div className= "form-wrapper"> <br/>
            Select the appropriate Option <br/>
            <b>Total audio files: {all_ids.length}</b> <br/>
            <b>Audios Completed: {comp}</b>
            
            <hr /> 
        
        
            <div className="questions">
              <b>Audio {all_ids.indexOf(currId) + 1}</b>
                <LoadQuestion 
                index={currInd}
                id={currId}
                audio={currAudio} 
                text={currText}
                handlechange={handleChange}
                handleEnded={setEnded}
                ended={isEnded}
                inputs={inputs}
                q3={q3}
                q3_1={q3_1}
                />
            { isEnded && 
            <Button variant="contained" onClick={handleSubmit} >Next</Button>
            }  
            </div>

        </div>
       
       </form>
       
     }

      {
        !user &&  isDone && <Done />
     }
    
     </>
    
    )
}

