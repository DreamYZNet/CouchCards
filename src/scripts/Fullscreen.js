
function isFullscreen() {
    return (window.innerHeight == window.screen.height && window.innerWidth == window.screen.width)
    //return (window.screen.height - window.innerHeight < 1 && window.screen.width - window.innerWidth < 5)
}

function openFullscreen(elem) {
    let success = true
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
        console.log("Firefox Fullscreen")
    }else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
        console.log("Webkit Fullscreen")
    }else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
        console.log("Microsoft Fullscreen")
    }else{
        success = false
    }
    // Lock into the current orientation so there arent any weird effects in fullscreen
    if (success){
        if (window.matchMedia("(orientation: portrait)").matches)
            window.screen.orientation.lock('portrait').catch(err=>{})
        if (window.matchMedia("(orientation: landscape)").matches)
            window.screen.orientation.lock('landscape').catch(err=>{})
    }
    return success
}

function closeFullscreen() {
    let success = true
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
        console.log("Firefox Fullscreen Off")
    }else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
        console.log("Webkit Fullscreen Off")
    }else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
        console.log("Microsoft Fullscreen Off")
    }else{
        success = false
    }
    // if (success)
    //     isFullscreen = false
    return success
}

export default {
    isFullscreen: isFullscreen,
    openFullscreen: openFullscreen,
    closeFullscreen: closeFullscreen
}

      // function isFullscreen(){ 
      //     //alert(window.outerHeight - window.innerHeight)
      //     return (1 <= window.outerHeight - window.innerHeight)
      // }