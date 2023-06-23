export const removeNulledObject = <T extends Record<string, unknown>>(obj: T): T => {
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] !== 'number' && !obj[key]) {
            Reflect.deleteProperty(obj, key);
        }
    }

    return obj;
}
