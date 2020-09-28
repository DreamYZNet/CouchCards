import {useState, useEffect} from 'react'
import axios from 'axios'
import Timer from '../scripts/Timer'

// This could honestly just be a regular javascript object.
// Theres no reason it should be a custom hook.

export default function useRoomServer() {
    
    const server = 'https://dreamyz.net/notwp/couchcards/php/'

    // const [onConnect, setOnConnect] = useState([])
    // const [onDataReceived, setOnDataReceived] = useState([])

    const [roomCode, setRoomCode] = useState(null)
    const [user, setUser] = useState(null)
    const [timeLastUpdated, setTimeLastUpdated] = useState(null)
    const [data, setData] = useState({})

    const [dataTimer, setDataTimer] = useState(null)

    useEffect(() => {
        if (dataTimer)
            dataTimer.setFunc(receiveData)
    })

    function connectToRoom(room, name) {
        
        sendData({}) // TEMPORARY FOR DUMB CORS REASONS
        receiveData() // TEMPORARY FOR DUMB CORS REASONS

        let url = server + 'new_player.php'
        let data = {room: room, data: {name: name}}
        axios.post(url, data)
        .then(res => {
            setUser(res.data)
            setRoomCode(room)
        })
        .catch(err => {
            console.log(err)
            if (err.response) {
                console.log(err.response.data)
                if (err.response.data == "you are already in the game") {
                    setRoomCode(room)
                }
            }
        })
    }

    function sendData(data) {
        let url = server + 'send_data.php'
        let payload = {room: roomCode, user: user, receiver: 0, data: data}
        axios.post(url, payload)
        .then(res => {
            console.log('success')
            console.log(res.data)
        })
        .catch(err => {
            if (err.response)
                console.log(err.response.data)
            console.log(err.response)
            console.log(err)
        })
    }

    function receiveData() {
        console.log('fetching data')
        // console.log('using time', timeLastUpdated)
        let url = server + 'get_data.php'
        let payload = {room: roomCode, user: user, time: timeLastUpdated}
        axios.post(url, payload
            //, JSON.stringify(data)
            //, { params: {room}}
        )
        .then(res => {
            //console.log('success')
            // Update time so that next receive data wont contain duplicate data
            setTimeLastUpdated(res.data[res.data.length-1].time)
            for (let packet of res.data) {
                // Turn data into readible objects
                try{
                    packet.data = JSON.parse(packet.data)
                }catch(e){}
                // Merge into previous data instead of replacing the entire thing
                setData(p => {
                    p[packet.sender] = packet
                    return {...p}
                })
            }
        })
        .catch(err => {
            if (err.response)
                console.log(err.response.data)
        })
    }

    function setDataInterval(seconds) {
        stopDataInterval()
        setDataTimer(
            new Timer(receiveData, seconds * 1000, true)
        )
    }

    function stopDataInterval() {
        if (dataTimer && dataTimer.running) {
            console.log("Interval stopped.")
            dataTimer.stop()
        }
    }

    // function addOnConnect(f) {
    //     setOnConnect( p => {return [...p, f]} )
    // }
    // function addOnDataReceived(f) {
    //     setOnDataReceived( p => {return [...p, f]} )
    // }

    return {
        connectToRoom: connectToRoom,
        sendData: sendData,
        receiveData: receiveData,
        setDataInterval: setDataInterval,
        stopDataInterval: stopDataInterval,
        // onConnect: (f) => { setOnConnect( p => {return [...p, f]} ) },
        // onDataReceived: (f) => { setOnDataReceived( p => {return [...p, f]} ) },
        // get roomCode(){ return roomCode },
        roomCode: roomCode,
        data: data,
        timeLastUpdated: timeLastUpdated
    }
}