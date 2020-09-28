// WIP if there are 2 use fullscreen hooks they will not function properly.
// Also this being a hook is super dumb

import {useState} from 'react'
import {isFullscreen, openFullscreen, closeFullscreen} from '../scripts/Fullscreen'

export default function useFullscreen(element) {

    const [fullscreen, setFullscreen] = useState(isFullscreen)

    return {
        isFullscreen: fullscreen,
        checkFullscreen: () => {
            alert(`ih:${window.innerHeight} sh:${window.screen.height} iw:${window.innerWidth} sw:${window.screen.width}`)
            return (window.innerHeight == window.height && window.innerWidth == window.width)
        },
        openFullscreen: () => {
            let success = openFullscreen(element)
            setFullscreen( success )
        },
        closeFullscreen: () => {
            let success = closeFullscreen(element)
            setFullscreen( !success )
        }
    }
}