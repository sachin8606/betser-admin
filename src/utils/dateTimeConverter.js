export const dateToLocal = (date) => {
    if (!date) return '';  // Handle empty or undefined input
    return new Date(date).toLocaleDateString();
};