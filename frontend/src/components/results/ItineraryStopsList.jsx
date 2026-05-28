<<<<<<< HEAD
import { useCallback } from 'react';
import { formatCategoryLabel, formatTimeDisplay } from '../../utils/generatedPlan';
import usePlaceReplacement from '../../hooks/usePlaceReplacement';

function ItineraryStopsList({ stops, onRemove, onReplace }) {
  const { findReplacement, isReplacing, getError, clearError } = usePlaceReplacement();

  const handleReplace = useCallback(async (stop) => {
    clearError(stop.order);
    const result = await findReplacement(stop, stops);
    if (result && onReplace) {
      onReplace(stop.order, result);
    }
  }, [findReplacement, stops, onReplace, clearError]);

  if (!stops?.length) return null;

  const getMapsSearchUrl = (stop) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name)}`;
  };

  const getMapsDirectionsUrl = (stop) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.name)}&travelmode=driving`;
  };

  // Check if stop has movie data or is a movie theater
  const hasMovieData = (stop) => {
    // Debug logging (can be removed after verification)
    if (stop.name && (stop.name.toLowerCase().includes('pvr') || 
                      stop.name.toLowerCase().includes('inox') || 
                      stop.name.toLowerCase().includes('cinema'))) {
      console.log('[Theatre Detection]', stop.name, {
        featured_movie: !!stop.featured_movie,
        movie_recommendations: !!stop.movie_recommendations,
        is_movie_theater: !!stop.is_movie_theater,
        types: stop.types,
        category: stop.category
      });
    }
    
    // Check for movie enrichment data
    if (stop.featured_movie || stop.movie_recommendations) {
      return true;
    }
    
    // Fallback: check if it's flagged as a movie theater
    if (stop.is_movie_theater) {
      return true;
    }
    
    // Fallback: check types array for movie_theater
    if (stop.types && Array.isArray(stop.types) && stop.types.includes('movie_theater')) {
      return true;
    }
    
    // Fallback: check if name contains common theater keywords
    const name = (stop.name || '').toLowerCase();
    const theaterKeywords = ['pvr', 'inox', 'cinepolis', 'cinema', 'theatre', 'theater', 'multiplex'];
    if (theaterKeywords.some(keyword => name.includes(keyword))) {
      return true;
    }
    
    return false;
  };

  // Get featured movie from stop
  const getFeaturedMovie = (stop) => {
    return stop.featured_movie || (stop.movie_recommendations && stop.movie_recommendations[0]);
  };

  // Always link to the BookMyShow homepage — simple and reliable.
  const getBookMyShowUrl = () => 'https://in.bookmyshow.com/';

  // Get Google search URL for movie + theater
  const getGoogleSearchUrl = (stop) => {
    const movie = getFeaturedMovie(stop);
    const theaterName = stop.name || '';
    const movieTitle = movie?.title || '';
    
    // Build search query with location context if available
    let searchQuery = '';
    
    if (movieTitle && theaterName) {
      searchQuery = `${movieTitle} ${theaterName}`;
    } else if (theaterName) {
      searchQuery = `${theaterName} movie tickets`;
    } else {
      searchQuery = 'movie tickets near me';
    }
    
    // Add location context if available
    if (stop.address) {
      searchQuery += ` ${stop.address}`;
    }
    
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        Itinerary
      </p>
      <ol className="mt-5 space-y-4">
        {stops.map((stop) => {
          const loading = isReplacing(stop.order);
          const errorMsg = getError(stop.order);
          
          return (
            <li
              key={`${stop.order}-${stop.name}`}
              className={`group relative flex gap-4 rounded-lg border bg-[var(--color-bg)] p-4 transition-colors hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)]/10 ${
                loading ? 'border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/5' : 'border-[var(--color-border)]'
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-accent)] text-sm font-bold text-[var(--color-accent)]">
                {loading ? (
                  <svg className="h-4 w-4 animate-spin text-[var(--color-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  stop.order
                )}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="break-words text-sm font-bold text-[var(--color-text-primary)]">
                    {loading ? 'Finding another place...' : stop.name}
                  </p>
                  {!loading && (
                    <span className="rounded-md border border-[var(--color-border)] bg-white px-2 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
                      {formatCategoryLabel(stop.category)}
                    </span>
                  )}
                </div>
                {!loading && (
                  <>
                    <p className="mt-1 text-xs font-semibold text-[var(--color-accent)]">
                      {formatTimeDisplay(stop.time)}
                      <span className="ml-1.5 font-normal text-[var(--color-text-muted)]">· {stop.duration_minutes} min</span>
                    </p>
                    <p className="mt-2 break-words text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {stop.description}
                    </p>
                    
                    {/* Movie Data Display (if available) */}
                    {hasMovieData(stop) && (
                      <div className="mt-3 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)]/10 p-3">
                        {(() => {
                          const movie = getFeaturedMovie(stop);
                          if (!movie) return null;
                          
                          return (
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                                  Now Showing: {movie.title}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  {movie.rating && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-accent)] px-2 py-0.5 text-xs font-semibold text-white">
                                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      {movie.rating}/10
                                    </span>
                                  )}
                                  {movie.genres && movie.genres.length > 0 && (
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                      {movie.genres.slice(0, 2).join(', ')}
                                    </span>
                                  )}
                                </div>
                                {movie.description && (
                                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                                    {movie.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
                
                {/* Error message */}
                {errorMsg && !loading && (
                  <p className="mt-2 text-xs font-medium text-red-600">{errorMsg}</p>
                )}

                {/* Interactive Action Row */}
                {!loading && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--color-border)] pt-3">
                    <div className="flex items-center gap-3">
                      {onReplace && (
                        <button
                          type="button"
                          onClick={() => handleReplace(stop)}
                          className="text-xs font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
                        >
                          Replace
                        </button>
                      )}
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(stop.order)}
                          className="text-xs font-semibold text-[var(--color-text-muted)] transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="hidden h-3 w-px bg-[var(--color-border)] sm:block" aria-hidden="true" />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {/* Movie theater specific actions */}
                      {hasMovieData(stop) && (
                        <>
                          <a
                            href={getBookMyShowUrl(stop)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
                            title="Book tickets on BookMyShow"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            Book on BookMyShow
                          </a>
                          <a
                            href={getGoogleSearchUrl(stop)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                            title="Search on Google"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search on Google
                          </a>
                        </>
                      )}
                      
                      {/* Standard location actions */}
                      <a
                        href={getMapsSearchUrl(stop)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                        title="View in Google Maps"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        View in Maps
                      </a>
                      <a
                        href={getMapsDirectionsUrl(stop)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                        title="Get directions"
                      >
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                        </svg>
                        Start Route
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
=======
import { formatCategoryLabel, formatTimeDisplay } from '../../utils/generatedPlan';

function ItineraryStopsList({ stops }) {
  if (!stops?.length) return null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-6 sm:p-8 backdrop-blur-sm">
      <h3 className="text-base font-semibold uppercase tracking-wider text-white">
        Itinerary
      </h3>
      <ol className="mt-6 space-y-4">
        {stops.map((stop) => (
          <li
            key={`${stop.order}-${stop.name}`}
            className="group relative flex gap-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-5 transition-all hover:border-white/[0.12] hover:bg-zinc-900/50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm font-bold text-white transition-all group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 group-hover:text-emerald-400">
              {stop.order}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="break-words font-semibold text-white">{stop.name}</p>
                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-zinc-500">
                  {formatCategoryLabel(stop.category)}
                </span>
              </div>
              <p className="mt-2 text-sm text-emerald-400">
                {formatTimeDisplay(stop.time)}
                <span className="text-zinc-500"> · {stop.duration_minutes} min</span>
              </p>
              <p className="mt-3 break-words text-sm leading-relaxed text-zinc-500">
                {stop.description}
              </p>
            </div>
          </li>
        ))}
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      </ol>
    </div>
  );
}

export default ItineraryStopsList;
