const convertDate = (time) => {
    if (time[time.length - 1] === 'Z') {
        time = time.substring(0, time.length - 1);
    } else {
        time = time.substring(0, time.length - 6);
    }   
    if (!time) {
        return null;
    }
    var date = new Date(time);

    var adjustedTime = date.toLocaleString()
    return adjustedTime;
}

export default convertDate;
