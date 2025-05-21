export const toUTCFromLocal = (dateStr) => {
    const localDate = new Date(dateStr);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
}