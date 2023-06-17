
export function checkKeyFormat(key: string): boolean {
    const regex = /^[A-F\d]{8}(-[A-F\d]{4}){3}-[A-F\d]{12}$/i;
    return regex.test(key) || key === '';
}
