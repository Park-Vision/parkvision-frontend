const getLocalISOTime = (time, timeZoneOffset) => {
        const date = new Date(time.toDate());
        const dateWithoutTimeZone = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ));

        const localISOTime = dateWithoutTimeZone.toISOString().split('Z')[0] + timeZoneOffset;
        return new Date(localISOTime).toISOString();
};
export default getLocalISOTime;