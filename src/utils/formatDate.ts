/**
 * Formats a date, if it was sent today it would show "Today at 12:00 PM", if it was sent yesterday it would show "Yesterday at 12:00 PM", if it was sent before that it would show "4/20/2024 12:00 PM" and if it was sent tomorrow it would show "Tomorrow at 12:00 PM
 */
const formatDate = (date: string | Date, onlyTime = false, long = false) => {
    const todaysDate = new Date();
    const dateObj = new Date(date);

    const opts = { hour: "2-digit", minute: "2-digit" } as const;

    if (onlyTime) {
        return dateObj.toLocaleTimeString(undefined, opts);
    }

    // ? long returns something like Saturday, May 11. 2024 12:00 PM
    if (long) {
        return dateObj.toLocaleString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    if (dateObj.toDateString() === todaysDate.toDateString()) {
        return `Today at ${dateObj.toLocaleTimeString(undefined, opts)}`;
    }

    todaysDate.setDate(todaysDate.getDate() - 1);

    if (dateObj.toDateString() === todaysDate.toDateString()) {
        return `Yesterday at ${dateObj.toLocaleTimeString(undefined, opts)}`;
    }

    todaysDate.setDate(todaysDate.getDate() + 2);

    if (dateObj.toDateString() === todaysDate.toDateString()) {
        return `Tomorrow at ${dateObj.toLocaleTimeString(undefined, opts)}`;
    }

    return dateObj.toLocaleString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export default formatDate;