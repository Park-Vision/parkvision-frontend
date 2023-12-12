
const convertDate = (time) => {
    if (!time) {
        return null;
    }
    var date = cutDate(time)

    var adjustedTime = date.toISOString()
    return adjustedTime;
}

const convertDateToLocaleString = (time) => {
    if (!time) {
        return null;
    }

    var date = cutDate(time)

    var adjustedTime = date.toLocaleString()
    return adjustedTime;
}

const cutDate = (time) => {

    if (time[time.length - 1] === 'Z') {
        time = time.substring(0, time.length - 1);
    }
    else {
        time = time.substring(0, time.length - 6);
    }

    var date = new Date(time);
    return date;
}

export { convertDate, convertDateToLocaleString };
