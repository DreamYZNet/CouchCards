import {useState} from 'react'

export default function useSelection(array, getFunc, setFunc, maxCards = 1) {

    const [selectionTopID, setSelectionTopID] = useState(0) // this has a bug, but it requires billions of clicks to occur

    function cardClick(e, el) {
        // If card is already selected
        if (getFunc(el) > 0) {
            setFunc(el, 0)
        }else{
            if (maxCards > 1 && getSelected().length < maxCards) {
                setFunc(el, selectionTopID + 1)
                setSelectionTopID(p => { return p+1 })
            // If selecting only 1 is allowed
            }else if (maxCards == 1) {
                unselectAll()
                setFunc(el, 1)
                setSelectionTopID(1)
            }
        }
    }
    function unselectAll() {
        for (let el of array) {
            setFunc(el, 0);
        }
        setSelectionTopID(0)
    }
    function getSelected() {
        return array.filter(el => {
            return (getFunc(el) > 0)
        })
    }
    function getUnselected() {
        return array.filter(el => {
            return !(getFunc(el) > 0)
        })
    }
    return {
        cardClick: cardClick,
        unselectAll: unselectAll,
        getSelected: getSelected,
        getUnselected: getUnselected
    }
}