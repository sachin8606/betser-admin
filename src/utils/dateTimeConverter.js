import formatDistanceToNow from "date-fns/formatDistanceToNow";
export const dateToLocal = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
};

export const formatDistanceToString = (date) => {
    const newDate = new Date(date);
    const relativeTime = formatDistanceToNow(newDate, { addSuffix: true });
    return relativeTime
}