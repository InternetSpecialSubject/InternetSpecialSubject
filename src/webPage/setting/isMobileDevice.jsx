export default function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}