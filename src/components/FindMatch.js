import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './FindMatch.css'

const FindMatch = (props) => {
    const [name, setName] = useState('')
    const [socket, setSocket] = useState(null);
    const [isFinding, setFinding] = useState(false);
    const [isFound, setFound] = useState(false);
    useEffect( () => {
        //open socket io connection on mounting
        const socketCon = io('http://127.0.0.1:5000/matchFinder');

        socketCon.on('findingMatch', data => {
            console.log(data);
        })

        socketCon.on('matchFound', data => {
            console.log(data);
            setFinding(false);
            setFound(true);
        })

        setSocket(socketCon);
        
    }, [])

    const handleFindButton = () => {
        setFinding(true);
        socket.emit('findMatch', name)
    }

    const handleCancelButton = () => {
        socket.emit('cancelFind', name)
        setFinding(false);
    }

    const handleInput = (e) => {
        setName(e.target.value)
    }

    const lookingForMatchComponent = isFinding ? (
        <div className="lookingForMatch-container" >
            <p>Looking for a match</p>
            <div className="loadingBar" >
                <div className="loadingBar-mini"></div>
            </div>
            <button onClick={handleCancelButton} className="cancel-button" >Cancel</button>
        </div>
    ) : null;

    const foundMatchComponent = isFound ? (
        <div className="lookingForMatch-container" >
            <p>Match found!</p>
        </div>
    ) : null;
    
    return (
        <div className="findMatch-container" >
            {foundMatchComponent}
            { lookingForMatchComponent }
            <input value={name} onChange={handleInput} placeholder="name" />
            <button disabled={isFinding} onClick={handleFindButton}  className="findMatch-button" >Find match</button>
        </div>
    )
}

export default FindMatch