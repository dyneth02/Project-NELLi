/**
 * API origin for absolute media URLs (Vite serves the app on a different port than Spring).
 */
function apiOrigin() {
  return (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
}

/**
 * Resolves a ticket attachment URL for use in {@code <img src>} etc.
 * Supports absolute http(s) URLs (e.g. Cloudinary) and API-relative paths from local storage.
 *
 * @param {string | undefined | null} fileUrl
 * @param {string} ticketId
 * @returns {string}
 */
export function resolveTicketAttachmentSrc(fileUrl, ticketId) {
  if (!fileUrl || !ticketId) return ''
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl
  const path = fileUrl.startsWith('/')
    ? fileUrl
    : `/api/v1/files/tickets/${ticketId}/${fileUrl}`
  return `${apiOrigin()}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * @param {Record<string, unknown> | null | undefined} att
 * @returns {boolean}
 */
export function isDisplayableTicketImage(att) {
  if (!att) return false
  const raw = att.fileUrl || att.url
  if (!raw) return false
  const ft = String(att.fileType || att.type || '').toLowerCase()
  if (ft.startsWith('image/')) return true
  if (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(String(raw))) return true
  return ft === '' || String(raw).includes('/image/upload/')
}
