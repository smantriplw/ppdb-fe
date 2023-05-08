export const isValidPassword = (date: string): boolean => {
    const matches = date.match(/.{2}/g);
    if (!matches || matches.length !== 4) return false;
    else return true;
}

export const parsedate = (str: string): string => {
    const formatDate = str?.split(',').at(-1);
    if (!formatDate) return '';
    const date = new Date(formatDate);

    return `${(date.getDate().toString().padStart(2, '0'))}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getFullYear()}`;
}
