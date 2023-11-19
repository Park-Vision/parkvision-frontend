const convertTime = (time, timezoneOffset) => {

    // if timezoneOffset == 'Z' then return time as is


    if (!time || !timezoneOffset) {
        return null;
    }

    if (timezoneOffset === 'Z') {
        //remowe Z from time
        time = time.substring(0, time.length - 1);
        
    }
    // Create a new Date object with the time
    var date = new Date(`1970-01-01T${time}`);
    // Parse the desired timezone offset
    var desiredOffset = parseInt(timezoneOffset);

    // if desiredOffset is NaN then return time as is
    if (isNaN(desiredOffset)) {
        return time;
    }
    // Add the desired offset to the date
    date.setUTCHours(date.getUTCHours() + desiredOffset);

    // Format the date to get the time in HH:MM format
    var adjustedTime = date.toISOString().substring(11, 16);

    return adjustedTime;
}

export default convertTime;
