const debounce = (func, delay = 1000) => {
    let timeoutId; 
    return (...args) => {
        // stop exsitone req
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // after one s from stop 
        timeoutId = setTimeout(() => {
            func.apply(null, args)
        },delay)
        
    }
}