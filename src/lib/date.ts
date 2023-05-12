export const dateMaps = {
    'mei': 'may',
    'januari': 'january',
    'agustus': 'august',
    'februari': 'february',
    'desember': 'december',
    'juni': 'june',
    'juli': 'july',
    'oktober': 'october',
}

export const isValidPassword = (date: string): boolean => {
    const matches = date.match(/.{2}/g);
    if (!matches || matches.length !== 4) return false;
    else return true;
}

export const parsedate = (str: string): string => {
    const formatDate = str?.split(',').at(-1);
    if (!formatDate) return '';
    const date = new Date(replaceDateWithMaps(str));

    return `${(date.getDate().toString().padStart(2, '0'))}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getFullYear()}`;
}

export const parsedate2 = (str: string): Date | undefined => {
    const formatDate = str?.split(',').at(-1);
    if (!formatDate) return undefined;
    return new Date(replaceDateWithMaps(str));
}

export const replaceDateWithMaps = (date: string): string => {
    let result = '';
    for (const key of Object.keys(dateMaps)) {
        result = date.toLowerCase().replace(key, dateMaps[key as keyof typeof dateMaps]);
        if (result.indexOf(dateMaps[key as keyof typeof dateMaps]) !== -1) {
            return result;
        }
    }

    return result;
}

export const isValidDate = (date: string): boolean => {
    return !isNaN(new Date(replaceDateWithMaps(date)).getTime());
}
