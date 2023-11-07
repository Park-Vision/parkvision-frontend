const convertTime = (time, timezoneOffset) => {

    if (!time || !timezoneOffset) {
        return null;
    }
    // Create a new Date object with the time
    var date = new Date(`1970-01-01T${time}`);
    // Parse the desired timezone offset
    var desiredOffset = parseInt(timezoneOffset);

    // Add the desired offset to the date
    date.setUTCHours(date.getUTCHours() + desiredOffset);

    // Format the date to get the time in HH:MM format
    var adjustedTime = date.toISOString().substring(11, 16);

    return adjustedTime;
}

export default convertTime;
