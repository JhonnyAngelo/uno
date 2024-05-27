export function errorMessage(message) {
    console.log(`>> ERROR: ${message} <<`);
}

export function inArray(value, arr) {
    for(let el of arr)
        if(value == el)
            return true;

    return false;
}

export function durstenfeldShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}