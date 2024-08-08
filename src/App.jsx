import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import { useRef } from 'react';

function App() {

  const [sessionTime, setSessionTime] = useState({minutes: 25, seconds: 0});
  const [sessionLast, setSessionLast] = useState(25)
  const [breakLast, setBreakLast] = useState(5)
  const [play, setPlay] = useState(false);
  const breakMoment = useRef(false)
  const intervalTime = useRef(null);

  const handleTimer = (event) => {    
    if(event.target.value == "start_stop"){
      setPlay(prevState => !prevState);
    } else if(event.target.value == "reset"){
      setPlay(false);
      breakMoment.current = false
      setSessionLast(25);
      setBreakLast(5);
      setSessionTime({minutes: 25, seconds: 0})
    }
  }

  const handleDuration = (event) => {
    const button = event.target.id;
    switch(button){
      case "session-decrement":
        if(breakMoment.current && !play){
          if(sessionLast <= 1){
            break;
          } else{
            setSessionLast(prev => prev - 1)
          }
        } else if(!breakMoment.current && !play){
          if(sessionTime.minutes < 1){
            break;
          } else {
            setSessionTime(prev => {return {minutes: prev.minutes - 1, seconds: prev.seconds}})
            setSessionLast(prev => prev - 1);
          }
        }
        break;
      case "session-increment":
        if(!play && !breakMoment.current) {
          setSessionTime(prev => {return {minutes: prev.minutes + 1, seconds: prev.seconds}})
          setSessionLast(prev => prev + 1);
        } else if (!play){
          setSessionLast(prev => prev + 1);
        }
        break;
      case "break-decrement":
        if(!breakMoment.current && !play){
          if(breakLast <= 1){
            break;
          } else{
            setBreakLast(prev => prev - 1)
          }
        } else if(breakMoment.current && !play){
          if(sessionTime.minutes < 1){
            break;
          } else {
            setSessionTime(prev => {return {minutes: prev.minutes - 1, seconds: prev.seconds}})
            setBreakLast(prev => prev - 1);
          }
        }
        break;
      case "break-increment":
        if(!play && breakMoment.current) {
          setSessionTime(prev => {return {minutes: prev.minutes + 1, seconds: prev.seconds}})
          setBreakLast(prev => prev + 1);
        } else if (!play){
          setBreakLast(prev => prev +1)
        }
        break;
    }
  }


  const timeDown = () => {
    setSessionTime(prev => {
      const {minutes, seconds} = prev;
      if(minutes > 0 && seconds == 0){
        return {minutes: minutes - 1, seconds: 59}
      } else if(minutes >= 0 && seconds > 0){
        return {...prev, seconds: seconds - 1}
      } else if(minutes === 0 && seconds === 0){        
        const audio = document.getElementById("beep");
        audio.play();
        breakMoment.current = !breakMoment.current;
        return {minutes: breakMoment.current ? breakLast : sessionLast, seconds: 0}
      }
    })
  }


  useEffect(() => {    
    if(play && !intervalTime.current){
      intervalTime.current = setInterval(timeDown,1000);
    } 
    if(!play && intervalTime.current){
      clearInterval(intervalTime.current);
      intervalTime.current = null;
    }
    return () => {
      if(intervalTime.current){
        clearInterval(intervalTime.current)
      }
    }
  },[play])

  return (
    <main>
      <div className="chrono-container">
        <h1>WORK/BREAK CLOCK</h1>
        <section className='time-section'>
          <div id="session-label">
            <button onClick={handleDuration} id="session-decrement">
              -
            </button>
            Session length: <span id="session-length">{sessionLast}</span>
            <button onClick={handleDuration} id="session-increment">
              +
            </button>
          </div>
          <div id="break-label">
            <button onClick={handleDuration} id="break-decrement">
              -
            </button>
            Break length: <span id="break-length">{breakLast}</span>
            <button onClick={handleDuration} id="break-increment">
              +
            </button>
          </div>
        </section>
        <section className="timer-section">
          <h3 id="timer-label">{breakMoment.current ? "Break" : "Work"}</h3>
          <h2 id="time-left">
            {sessionTime.minutes}:{sessionTime.seconds < 10 
            ? "0"+sessionTime.seconds 
            : sessionTime.seconds}
          </h2>
          <audio src="https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" id="beep"></audio>
        </section>
        <section className="control-container">
          <button onClick={handleTimer} value="start_stop" id="start_stop">
            <span className="material-symbols-outlined">{!play ? "play_arrow": "pause"}</span>
          </button>
          <button onClick={handleTimer} value="reset" id="reset">
            <span className="material-symbols-outlined">
            fast_rewind
            </span>
          </button>
        </section>
      </div>
    </main>
  )
}

export default App
