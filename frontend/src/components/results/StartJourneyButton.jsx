import { useState } from 'react';
import { openGoogleMapsNavigation, canGenerateNavigation } from '../../utils/googleMapsNavigation';

/**
 * StartJourneyButton
 * 
 * A clean, modern button that launches the full itinerary in Google Maps
 * with all stops in the correct sequence.
 * 
 * Features:
 * - Respects itinerary order (no Google Maps optimization)
 * - Supports all transport modes
 * - Mobile-friendly (opens Google Maps app when available)
 * - Handles edge cases (missing coords, too many stops, etc.)
 * - Live synchronization with itinerary changes
 */
function StartJourneyButton({ stops, travelMode = 'driving', className = '' }) {
  const [isOpening, setIsOpening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Check if we have enough valid stops for navigation
  const canNavigate = canGenerateNavigation(stops);
  
  const handleClick = () => {
    if (!canNavigate || isOpening) return;
    
    setIsOpening(true);
    
    try {
      const success = openGoogleMapsNavigation(stops, travelMode);
      
      if (!success) {
        // Show error feedback
        alert('Unable to open Google Maps. Please check your stops have valid locations.');
      }
    } catch (error) {
      console.error('[StartJourneyButton] Error opening navigation:', error);
      alert('An error occurred while opening Google Maps.');
    } finally {
      // Reset state after a short delay
      setTimeout(() => setIsOpening(false), 1000);
    }
  };
  
  // Don't render if not enough stops
  if (!canNavigate) {
    return null;
  }
  
  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={isOpening}
        className={`
          group relative inline-flex items-center gap-2.5 overflow-hidden
          rounded-xl border-2 border-[var(--color-accent)] 
          bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]
          px-6 py-3 text-sm font-semibold text-white
          shadow-lg shadow-[var(--color-accent)]/25
          transition-all duration-200
          hover:shadow-xl hover:shadow-[var(--color-accent)]/35
          hover:scale-[1.02]
          active:scale-[0.98]
          disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100
          ${className}
        `.trim()}
        aria-label="Start journey in Google Maps"
      >
        {/* Icon */}
        <svg 
          className={`h-5 w-5 transition-transform duration-200 ${isOpening ? 'animate-pulse' : 'group-hover:scale-110'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317.159.69.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" 
          />
        </svg>
        
        {/* Text */}
        <span className="relative">
          {isOpening ? 'Opening Maps...' : 'Start Journey'}
        </span>
        
        {/* Arrow icon */}
        <svg 
          className={`h-4 w-4 transition-transform duration-200 ${isOpening ? '' : 'group-hover:translate-x-0.5'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" 
          />
        </svg>
        
        {/* Shine effect on hover */}
        <span 
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"
          aria-hidden="true"
        />
      </button>
      
      {/* Tooltip */}
      {showTooltip && !isOpening && (
        <div 
          className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] shadow-lg"
          role="tooltip"
        >
          Navigate all stops in Google Maps
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-[var(--color-border)] bg-white" />
        </div>
      )}
    </div>
  );
}

export default StartJourneyButton;
