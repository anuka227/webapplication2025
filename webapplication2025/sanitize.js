/**
 * HTML тэмдэгтүүдийг аюулгүй болгох
 */
export function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Хэрэглэгчийн оруулсан текст цэвэрлэх
 */
export function sanitizeText(text, maxLength = 1000) {
    if (!text) return '';
    return escapeHTML(String(text)).trim().slice(0, maxLength);
}

/**
 * HTML attribute-д хэрэглэх escape
 */
export function escapeAttr(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Email зөв формат эсэхийг шалгах
 */
export function sanitizeEmail(email) {
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleaned = email.toLowerCase().trim();
    if (!emailRegex.test(cleaned)) {
        console.warn('Invalid email:', email);
        return '';
    }
    return cleaned;
}

/**
 * Утасны дугаарыг цэвэрлэх
 */
export function sanitizePhone(phone) {
    if (!phone) return '';
    return phone.replace(/[^0-9+\-() ]/g, '').trim();
}

/**
 * URL аюулгүй эсэхийг шалгах
 */
export function sanitizeURL(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            console.warn('Invalid protocol:', parsed.protocol);
            return '';
        }
        return parsed.href;
    } catch (e) {
        console.warn('Invalid URL:', url);
        return '';
    }
}

/**
 * Аюултай HTML tags устгах
 */
export function removeDangerousHTML(html) {
    if (!html) return '';
    return String(html)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
}

/**
 * innerHTML-г аюулгүй тохируулах
 */
function setInnerHTML(element, html) {
    if (!element) return;
    const cleaned = removeDangerousHTML(html);
    element.innerHTML = cleaned;
}

// Global window объект дээр нэмэх
window.sanitize = {
    escapeHTML,
    sanitizeText,
    escapeAttr,
    sanitizeEmail,
    sanitizePhone,
    sanitizeURL,
    removeDangerousHTML,
    setInnerHTML
};

// Эсвэл товчхон
window.s = window.sanitize;