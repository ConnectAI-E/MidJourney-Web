// url image to base64
// "blob:http://localhost:5173/6d17c042-a35d-4dc8-a235-433289ba338b"
//  ->
// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYA.."


export function urlToBase64(url:string) {
    if (!url) {
        return ""
    }
    return fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });
}
