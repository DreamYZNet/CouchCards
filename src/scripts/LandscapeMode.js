
export default function LandscapeMode(element) {

    let defaultWidth = element.style.width
    let defaultHeight = element.style.height
    
    element.classList.add('landscape')
    updateLandscapeSize()
    window.addEventListener('resize', updateLandscapeSize)
    //window.addEventListener("orientationchange", updateLandscapeSize)

    function remove() {
        element.classList.remove('landscape')
        window.removeEventListener('resize', updateLandscapeSize)
        resetSize()
    }

    function updateLandscapeSize() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            element.style.width = element.parentNode.clientHeight+'px'
            element.style.height = element.parentNode.clientWidth+'px'
        }else{
            resetSize()
        }
    }

    function resetSize() {
        if (defaultWidth)
            element.style.width = defaultWidth
        else
            element.style.removeProperty('width')
        if (defaultHeight)
            element.style.height = defaultHeight
        else
            element.style.removeProperty('height')
    }

    return {remove: remove}
}
