const convertDate = (time, timezoneOffset = "0") => {
    // cut last 5 characters from time string
    time = time.substring(0, time.length - 6);
    if (!time) {
        return null;
    }
    // Create a new Date object with the time
    var date = new Date(time);

    // Format the date to get the time in HH:MM format
    var adjustedTime = date.toLocaleString()
    return adjustedTime;
}

export default convertDate;
