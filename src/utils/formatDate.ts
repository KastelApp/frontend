/**
 * Formats a date, if it was sent today it would show "Today at 12:00 PM", if it was sent yesterday it would show "Yesterday at 12:00 PM", if it was sent before that it would show "4/20/2024 12:00 PM" and if it was sent tomorrow it would show "Tomorrow at 12:00 PM
 */
const formatDate = (date: string | Date) => {
    const todaysDate = new Date();
    const dateObj = new Date(date);

    if (dateObj.toDateString() === todaysDate.toDateString()) {
        return `Today at ${dateObj.toLocaleTimeString()}`;
    }

    todaysDate.setDate(todaysDate.getDate() - 1);

    if (dateObj.toDateString() === todaysDate.toDateString()) {
        return `Yesterday at ${dateObj.toLocaleTimeString()}`;
    }

    todaysDate.setDate(todaysDate.getDate() + 2);

    if (dateObj.toDateString() === todaysDate.toDateString()) {
        return `Tomorrow at ${dateObj.toLocaleTimeString()}`;
    }

    return dateObj.toLocaleString();
}

export default formatDate;