import { useState } from 'react';
import { buildShareUrl, copyTextToClipboard } from '../../utils/shareLinks';

function ShareButton({ shareId, label = 'Copy Link', className = '' }) {
  const [status, setStatus] = useState('');

  const handleCopy = async () => {
    setStatus('');
    try {
      await copyTextToClipboard(buildShareUrl(shareId));
      setStatus('Copied');
    } catch {
      setStatus('Copy failed');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!shareId}
      className={className}
      title={shareId ? buildShareUrl(shareId) : 'Save this itinerary before sharing'}
    >
      {status || label}
    </button>
  );
}

export default ShareButton;
