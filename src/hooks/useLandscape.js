import {useLayoutEffect} from 'react'
import LandscapeMode from '../scripts/LandscapeMode'

function useLandscape(ref) {
    useLayoutEffect(() => {
        var landscape
        if (ref.current)
            landscape = new LandscapeMode(ref.current)
        return () => {
            if (landscape)
                landscape.remove()
        }
    }, [ref.current])//ref
}

export default useLandscape
