import { ROUTES } from '../routes/paths';

export function buildShareUrl(shareId) {
  if (!shareId) return '';
  return `${window.location.origin}${ROUTES.SHARED_TRIP.replace(':shareId', shareId)}`;
}

export async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
