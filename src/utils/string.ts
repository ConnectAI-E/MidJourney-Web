
export function checkKeyFormat(key: string): boolean {
    const regex = /^[A-F\d]{8}(-[A-F\d]{4}){3}-[A-F\d]{12}$/i;
    return regex.test(key) || key === '';
}

export function afterTrimStartWith(str: string, prefix: string): boolean {
    return str.trim().toLowerCase().startsWith(prefix);
}

export function afterTrimStartWithMulti(str: string, prefixs: string[]): boolean {
    return prefixs.some((prefix) => {
        return str.trim().toLowerCase().startsWith(prefix);
    });
}

