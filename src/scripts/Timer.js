
export default function Timer(func = null, seconds = null, looping = false, paused = false) {

    let timeout
    let startingTime
    let running = false

    if (!paused && func && seconds > 0)
        start()

    function start() {
        // setTimeout(()=>{
        //     debugDisplay()
        // }, seconds/2)
        running = true
        startingTime = new Date()
        updateTimer()
    }
    function stop() {
        clearTimeout(timeout)
        running = false
    }
    function updateTimer() {
        if (running) {
            // console.log('timeout cleared', timeout)
            clearTimeout(timeout)
            timeout = setTimeout(onTimeout, remaining())
        }
    }
    function onTimeout() {
        // console.log('timed out at:', new Date())
        if (looping)
            start()
        else
            running = false
        func()
    }
    function setFunc(f) {
        func = f
        updateTimer()
    }
    function remaining() {
        return seconds - elapsed()
    }
    function elapsed() {
        return new Date() - startingTime
    }
    // function debugDisplay() {
    //     console.log('~~~TIMER DEBUG~~~')
    //     console.log('seconds', seconds)
    //     let elapsed_ = elapsed()
    //     let remaining_ = remaining()
    //     console.log('elapsed', elapsed_)
    //     console.log('remaining', remaining_)
    //     console.log('startingTime', startingTime)
    //     console.log('currentTime', new Date())
    //     console.log('~~~~~~~~~~~~~~~~~')
    // }

    return {
        setFunc: setFunc,
        start: start,
        stop: stop,
        running: running
    }
}