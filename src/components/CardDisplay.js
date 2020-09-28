import React, {useState, useLayoutEffect, useRef} from 'react'

function CardDisplay (props) {

    const divRef = useRef()
    const firstCardRef = useRef(null)

    const [cardWidth, setCardWidth] = useState(0)
    // Margin left for cards to create a stacked effect
    const [marginLeft, setMarginLeft] = useState(null)

    // When cardWidth changes, update cards left margin
    useLayoutEffect(() => {
        updateMargins(cardWidth, props)
    }, [cardWidth, props.children])

    // When windows size changes, update the display (cardwidth and marginleft)
    useLayoutEffect(() => {
        // We do a delayed update to allow other priority changes first (kinda hacky tho tbh)
        let func = e => {
            //setTimeout(() => {
                updateMargins(
                    updateCardWidth(firstCardRef), props
                ) 
            //}, 1);
        }
        window.addEventListener('resize', func)
        return () => {
            window.removeEventListener('resize', func)
        }
    }, [updateCardWidth, props.children])

    function updateCardWidth(cardRef) {
        setCardWidth(cardRef.current.clientWidth)
        console.log('card loaded, imagewidth:', cardRef.current.clientWidth)
        return cardRef.current.clientWidth
    }

    function updateMargins(cardWidth, props) {
        if (props.children.length <= 1 || cardWidth <= 0)
            return

        let cardsTotalWidth = (cardWidth+1) * props.children.length;
        let extraWidth = cardsTotalWidth - (divRef.current.clientWidth - 2); // idk about that one
        if (extraWidth > 0)
            setMarginLeft( -extraWidth / (props.children.length-1) + 'px' )
        else
            setMarginLeft(0)
    }

    return (
        <div 
            ref={divRef} 
            style={{
                //outline: 'solid red 8px', 
                height: '100%',
                width: '100%',
                overflow:'hidden', 
                //display:'inline-block',
                textAlign: marginLeft == 0 ? 'center' : undefined
            }}
        >   
            {props.children.length > 0 ? 
                React.cloneElement(props.children[0], {
                    onLoad:updateCardWidth,
                    useRef:firstCardRef,
                    style:{...props.children[0].props.style}}//, float: 'left'
                ) 
                : null
            }
            {cardWidth > 0
                ? props.children.slice(1).map((card, i) => {
                    return (
                        React.cloneElement(card, {style:{...card.props.style, marginLeft:marginLeft}})
                    )
                })
                : null
            }
        </div>
    )
}

export default CardDisplay
