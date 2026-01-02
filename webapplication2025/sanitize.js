/**
 * HTML тэмдэгтүүдийг аюулгүй болгох
 * 
 * < → &lt;
 * > → &gt;
 * & → &amp;
 * " → &quot;
 * ' → &#39;
 */
export function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
/**
 * Хэрэглэгчийн оруулсан текст цэвэрлэх
 * 
 * - HTML escape хийх
 * - Хоосон зай арилгах (trim)
 * - Урт текст тасдах
 */
export function sanitizeText(text, maxLength = 1000) {
    if (!text) return '';
    
    return escapeHTML(String(text))  
        .trim()
        .slice(0, maxLength);
}
/**
 * HTML attribute-д хэрэглэх escape
 * Жишээ:
 * <img src="..." alt="...">
 * <a href="..." title="...">
 * Шалтгаан:
 * alt="user's photo" → Алдаа! (нэг quote хаана төгссөн бэ?)
 * alt="user&#39;s photo" → Зөв!
 */
export function escapeAttr(str) {
    if (!str) return '';
    
    return String(str)
        .replace(/&/g, '&amp;')   // & → &amp; (эхлээд!)
        .replace(/"/g, '&quot;')  // " → &quot;
        .replace(/'/g, '&#39;')   // ' → &#39;
        .replace(/</g, '&lt;')    // < → &lt;
        .replace(/>/g, '&gt;');   // > → &gt;
}
/**
 * Email зөв формат эсэхийг шалгах
 * 
 * Зөв: test@example.com
 * Буруу: test@, @example.com, not-an-email
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
 * 
 * Зөвшөөрөгдөх: 0-9, +, -, (), зай
 * Хасагдах: үсэг, тэмдэгт
 */
export function sanitizePhone(phone) {
    if (!phone) return '';
    return phone
        .replace(/[^0-9+\-() ]/g, '')
        .trim();
}
/**
 * URL аюулгүй эсэхийг шалгах
 * 
 * Зөвшөөрөх: http://, https://
 * Хориглох: javascript:, data:, file:
 * 
 * Шалтгаан:
 * <a href="javascript:alert(1)"> ← Аюултай!
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
 * 
 * Устгах:
 * - <script>...</script>
 * - <iframe>...</iframe>
 * - javascript:...
 * - on* events (onclick, onerror, etc)
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
 * 
 * innerHTML ашиглах нь аюултай байж болно.
 * Энэ функц хортой код цэвэрлэж өгнө.
 */
export function setInnerHTML(element, html) {
    if (!element) return;
    
    const cleaned = removeDangerousHTML(html);
    element.innerHTML = cleaned;
}