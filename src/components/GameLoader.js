import React, {useState, useEffect, useRef} from 'react'
import HandLoader from './HandLoader'
import useRoomServer from '../hooks/useRoomServer'
import useLandscape from '../hooks/useLandscape'
import titleImage from '../assets/title.png'

function GameLoader() {

    const server = useRoomServer()

    const [roomText, setRoomText] = useState('')
    const [nameText, setNameText] = useState('')
    const divRef = useRef()
    // useLandscape(document.documentElement)
    useLandscape(divRef)

    // When we connect to a room we need to start pinging the server for updates
    useEffect(() => {
        if (server.roomCode) {
            console.log('Successfully connected to:', server.roomCode)
            server.setDataInterval(1)
        }
    }, [server.roomCode])

    const fieldStyle = {
        height:'25px', border:'solid black 1px', borderBottom:'solid black 2px', fontWeight:'bold', margin:'0px'
    }
    const fieldDivStyle = {
        fontWeight: 'bold', flexGrow: 1, height:0, minHeight: '40px'//, padding:'10%', paddingTop:0
    }

    //, border:'solid red 1px'
    return (
        <div style={{width: '100%', height: '100%'}}>

            {/* If room has loaded */}
            {server.roomCode ?
                <div ref={divRef} style={{width: '100%', height: '100%'}}>
                 <HandLoader server={server}/>
                </div>

            : /* If we haven't joined a room yet */
                <form style={{width: '100%', height: '100%'}}>
                <div style={{
                    textAlign:'center', 
                    borderRadius: '50px', 
                    border: 'solid red 5px', 
                    display:'flex', flexDirection:'column', justifyContent:'space-evenly',
                    height: '90%'//, align:'auto'
                }}>
                    <div style={{flexGrow:2}}></div>
                    <div><img src={titleImage} style={{width:'0%', maxHeight:'10%', heigh:'auto'}}></img></div>
                    <div style={{...fieldDivStyle}}>
                        Room:&#160;
                        <input type='text' value={roomText} onChange={e=> {
                            setRoomText(e.target.value.toUpperCase().slice(0, 4))
                        }} style={fieldStyle} />
                    </div>

                    <div style={fieldDivStyle}>
                        Name: <input type='text' value={nameText} onChange={e=> setNameText(e.target.value) } style={fieldStyle} />
                    </div>

                    <div style={{flexGrow: 2}}>
                        <input type='submit' value='Play Game' style={{
                            color: 'white', background:'red', 
                            borderWidth:'2px', borderColor:'#f33', borderRadius:'8px',
                            fontWeight: 'bold', fontSize:'25px', padding:'5px 10px'}}
                            onClick={e=>{ e.preventDefault(); e.currentTarget.focus(); server.connectToRoom(roomText, nameText); }}
                        />
                    </div>

                    <div style={{marin:'30%', alignSlf:'flex-end', flexGrow: 1}}>Created by DreamYz</div>
                </div>
                </form>
            }
        </div>
    )
}

export default GameLoader
