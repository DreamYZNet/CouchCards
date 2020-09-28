import React, {useState, useEffect, useLayoutEffect} from 'react'
import CardDisplay from './CardDisplay'
import Card from './Card'
import importImages from '../scripts/ImportImages'
import checkIfPlayable, {getNumberInt, getSuit} from '../scripts/RuleChecker'
import Fullscreen from '../scripts/Fullscreen'
import useSelection from '../hooks/useSelection'

function HandLoader(props) {

    const images = importImages()

    const padding = '10px'
    const selectedStyle = {
        WebkitFilter: 'sepia(100%)'
    }

    // States
    const [cards, setCards] = useState([
        // {name: '7D'}, 
        // {name: 'AS'}, 
        // {name: 'KC'}, 
        // {name: '4H'} 
    ])
    const [buttons, setButtons] = useState([])
    const [isCardsOrdered, setIsCardsOrdered] = useState(true)

    const [canPlay, setCanPlay] = useState(false)
    const [loading, setLoading] = useState(false)
    const [displaySendCardsButton, setDisplaySendCardsButton] = useState(false)
    //const [displayReadyButton, setDisplayReadyButton] = useState(false)

    const selection = useSelection(
        cards,
        (c)=>{return c['selected']}, //get func
        (c,v)=>{c['selected'] = v}, //set func
        props.server.data[0] ? props.server.data[0].data.maxCards : 1 //max cards
    )

    // New data received
    useEffect(() => {
        let data = props.server.data[0] ? props.server.data[0].data : null
        if (data) {
            console.log('Data received:', data)
            // if (data === "ready_button") {
            //     setDisplayReadyButton(true)
            // }
            if (data.cards) {
                let newCards = []
                for (let c of data.cards)
                    newCards.push({name: c})
                setCards(newCards)
            }
            if (data.buttons)
                setButtons(data.buttons)//.reverse())
            setCanPlay(data.turn)
            setLoading(false)
        }
        // Now wait a minute theres no way this is right WIP
        setDisplaySendCardsButton(false)
        selection.unselectAll()
    }, [props.server.data])

    // Card management
    function getSelectedCardNames() {
        return selection.getSelected()
        .sort((a, b)=>{
            return a['selected'] - b['selected']
        })
        .map((card)=>{ 
            return card.name 
        })
    }
    
    function removeSelectedCards() { // Don't delete even if unusued
        setCards(selection.getUnselected())
    }

    function cardClick(e, card) {
        if (canPlay) {
            selection.cardClick(e, card) 
            setCards([...cards])
            let fieldCard = null
            try{ fieldCard = props.server.data[0].data.field[0] }catch(err){}
            let rules = {}
            try{ rules = props.server.data[0].data.rules }catch(err){}
            setDisplaySendCardsButton(
                checkIfPlayable(
                    getSelectedCardNames(),
                    fieldCard,
                    rules
                )
            )
        }
    }

    function orderCards(cards) {
        return cards.sort((a, b) => {
            //let numberResult = getNumber(a.name) - getNumber(b.name)
            let numberResult = getNumberInt(a.name) - getNumberInt(b.name)
            //console.log(`compare num ${getNumber(a.name)} ${getNumber(b.name)} :`, numberResult)
            if (numberResult != 0)
                return numberResult
            // Looks complex, but just compares the strings
            let suitResult = getSuit(a.name).localeCompare(getSuit(b.name))
            //console.log(`compare suit ${getSuit(a.name)} ${getSuit(b.name)} :`, suitResult)
            return suitResult
        })
    }

    var buttonStyle = {
        height: '100%', width: '20%',
        float: 'right', marginLeft: padding,
        background: '#d22', 
        border: 'solid #c33 0px', borderRadius: '8px', 
        color: 'white', fontWeight: 'bold', fontSize: '15px'//textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
    }

    var grayButtonStyle = {
        background: '#888'
    }

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
            <div id='title-bar' style={{width: '100%', height: 0, flexGrow: 1, background: 'black', color: 'white'}}>
                <div style={{paddingTop:'8px', paddingLeft:'15px'}}>{!canPlay || loading ? 'Please wait...' : null}</div>
            </div>

            <div id='card-container' style={{padding: padding, paddingBottom: 0, flexGrow: 7, height: '0'}}>
                <CardDisplay>
                    {(isCardsOrdered ? orderCards(cards) : cards).map(c => (
                        <Card 
                            name={c.name} 
                            style={c.selected ? {...selectedStyle} : null}
                            //{{...c.style, c.selected ? ...selectedStyle : null}}
                            //useRef={c.ref}
                            onClick={e => { 
                                cardClick(e, c)
                            }}
                            src={images['./'+c.name+'.png']}
                            key={c.name}
                        />
                    ))}
                </CardDisplay>
            </div>
            
            <div id='button-container' style={{flexGrow: 1, height: 0, padding: padding}}>
                {/* Confirm button */}
                {/* If it's the players turn etc, then display buttons */}
                {canPlay || true ?
                    buttons.map(button => {
                        let buttonName
                        let buttonEnabled
                        let confirm = false
                        let signal = null
                        if (typeof button == 'string') {
                            buttonName = button
                            buttonEnabled = canPlay && !loading
                            signal = buttonName
                        }else if (Array.isArray(button)) {
                            buttonName = button[0]
                            if (button.length >= 2)
                                buttonEnabled = !loading && button[1]
                            else
                                buttonEnabled = canPlay && !loading
                            signal = buttonName
                        }else if (typeof button === 'object' && button !== null) {
                            buttonName = button.name
                            if ('active' in button)
                                buttonEnabled = !loading && button.active
                            else
                                buttonEnabled = canPlay && !loading
                            confirm = button.confirm
                            signal = 'signal' in button ? button.signal : button.name
                        }
                        if (!confirm)
                            return(
                                <button className='borderless-focus' key={buttonName} 
                                    style={{...buttonStyle, ...(buttonEnabled ? null : grayButtonStyle)}} 
                                    onClick={buttonEnabled ? e=>{
                                        e.preventDefault();
                                        //if (!canPlay) return
                                        let data = {signals: [signal]}
                                        setCanPlay(false)
                                        setLoading(true)
                                        props.server.sendData(data)
                                    }:null}
                                >{buttonName}</button>
                            )
                        else if (confirm && cards.length > 0)
                            return (
                                <button className='borderless-focus' key={buttonName}
                                    style={{...buttonStyle, ...(canPlay && !loading && displaySendCardsButton ? null : grayButtonStyle)}} 
                                    onClick={e=>{
                                        e.preventDefault();
                                        if (!(canPlay && !loading && displaySendCardsButton)) return
                                        let data = {cards: getSelectedCardNames(), signals: [signal]}
                                        setCanPlay(false)
                                        setLoading(true)
                                        props.server.sendData(data)
                                        //removeSelectedCards() // Artistic choice, so don't remove
                                    }}
                                >{buttonName}</button>
                            )
                    })
                    : null
                }
                
                {/* Fullscreen button */}
                <button className='borderless-focus'
                    style={{
                        height: '100%', width: '20%', 
                        border: 'solid red 1px', borderRadius: '15px', 
                        color: 'black', background: 'white', fontWeight: 'bold', fontSize: '15px'
                    }}
                    onClick={e => {
                        if (!Fullscreen.isFullscreen())
                            Fullscreen.openFullscreen(document.documentElement)
                        else
                            Fullscreen.closeFullscreen()
                    }}
                >
                    Fullscreen{//text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
                    }
                </button>

            </div>
        </div>
    )
}

export default HandLoader
