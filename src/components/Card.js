import React, {useRef} from 'react'

function Card (props) {

    const imgRef = useRef();

    return (
        <img 
            id={props.name}
            src={props.src} 
            ref={props.useRef || imgRef} 
            onLoad={() => props.onLoad && props.onLoad(props.useRef || imgRef)} 
            onClick={e => {props.onClick && props.onClick(e)}}
            alt={props.name}
            style={{
                height:'100%',
                maxHeight:'100%', 
                maxWidth:'100%', 
                position:'relative', //required to keep their overlap in order
                ...props.style
            }}
        />
    )
}

export default Card
