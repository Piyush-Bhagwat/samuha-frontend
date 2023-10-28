const getTime = (timeStr) => {
    const originalDate = new Date(timeStr);
    // Format the time in "hh:mm am/pm" format
    const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(originalDate);// Example output: "07:59 AM"
    return formattedTime;
};

export { getTime };
