
function sameNumber(card1, card2) {
    return (getNumber(card1) == getNumber(card2))
}
function sameSuit(card1, card2) {
    return (getSuit(card1) == getSuit(card2))
}

export function getNumber(card) {
    return card.substr(0, card.length-1)
}
export function getNumberInt(card) {
    var number = getNumber(card)
    switch(number) {
        case 'A':
            return 1
        case 'J':
            return 11
        case 'Q':
            return 12
        case 'K':
            return 13
        default:
            return Number(number)
    }
}
export function getSuit(card) {
    return card.substr(card.length-1)
}

export default function checkMove(cards, fieldCard, rule, cardIndex = 0, lastCard = null){
    console.log(cards)
    let amount = checkMoveAmount(cards, fieldCard, rule, cardIndex, lastCard)
    //	print('final: '+str(amount))
    return amount == cards.length-cardIndex
    //	return (amount != -1)
}

function checkMoveAmount(cards, fieldCard, rule, cardIndex = 0, lastCard = null) {
    // console.log('rule: '+rule)
    //	let fieldCard = stack[-1].name
    //	let fieldCard = '4D'
    if (lastCard == null)
        lastCard = fieldCard

    if (Array.isArray(rule)) {
        // Determine array properties
        let sequencial = false
        let startIndex = 0
        let count = -1
        if (rule[0] == '>') { //typeof rule[0] == 'string'
            sequencial = true
            startIndex = 1
            count = 0
        }
            
        // Loop through array
        for (let ri = startIndex; ri < rule.length; ri++) {
            let r = rule[ri]
            let resultNum = checkMoveAmount(cards, fieldCard, r, cardIndex, lastCard)
            // Sequencial
            if (sequencial) {
                if (resultNum == -1)
                    return -1
                count += resultNum
                cardIndex += resultNum
                lastCard = cards[cardIndex-1]
            // One from group
            }else{
                // Keep count the highest received num
                if (resultNum > count)
                    count = resultNum
                // If result is a number then return it
    //				if resultNum != -1:
            }
    //					return resultNum
        }
        return count
                    
    }else if (typeof rule == 'string') {
        // Determine rule string properties
        let firstChar = rule.substr(0, 1)
        let special
        if (firstChar == '*' || firstChar == '+') {
            special = firstChar
            rule = rule.substr(1, rule.length-1)
        }
            
        // Set count values
        let minCount = 1
        let maxCount = 1
        if (special == '*') {
            minCount = 0
            maxCount = Number.POSITIVE_INFINITY
        }else if (special == '+') {
            maxCount = Number.POSITIVE_INFINITY
        }
        
        let count = 0
        let result = true
        while (result && count < maxCount && cardIndex < cards.length) {
            switch (rule) {
                case 'sameSuit':
                    result = sameSuit(cards[cardIndex], fieldCard)
                    break
                case 'sameNumber':
                    result = sameNumber(cards[cardIndex], fieldCard)
                    break
                case 'lastSuit':
                    result = sameSuit(cards[cardIndex], lastCard)
                    break
                case 'lastNumber':
                    result = sameNumber(cards[cardIndex], lastCard)
                    break
                case 'any':
                    result = true
                    break
                default:
                    result = (cards[cardIndex] == rule)
            }
            if (result) {
                count += 1
                cardIndex += 1
            }
        }
        if (count >= minCount)
            return count
    }
    return -1
}