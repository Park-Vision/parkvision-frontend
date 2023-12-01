const convertDate = (time, timezoneOffset = "0") => {
    var date = cutDate(time)

    var adjustedTime = date.toISOString()
    return adjustedTime;
}

const convertDateToLocaleString = (time) => {
    var date = cutDate(time)

    var adjustedTime = date.toLocaleString()
    return adjustedTime;
}

const cutDate = (time) => {
    time = time.substring(0, time.length - 6);
    if (!time) {
        return null;
    }
    var date = new Date(time);
    return date;
}

export { convertDate, convertDateToLocaleString };
