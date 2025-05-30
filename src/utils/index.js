export const toUTCFromLocal = (dateStr) => {
    const localDate = new Date(dateStr);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
}

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}