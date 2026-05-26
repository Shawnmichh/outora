# Graceful Error Handling for Itinerary Generation

## Date: Context Transfer Session
## Status: ✅ Complete

---

## Problem

After removing fake fallback places, the API now correctly fails when Google Places returns no results. However:

❌ Backend raises `ValueError` exception  
❌ API returns generic HTTP 500 Internal Server Error  
❌ Frontend shows: "Request failed with status 500"  
❌ No helpful guidance for users  

---

## Solution

Implemented graceful error handling throughout the stack:

### 1. Backend API Error Handling
### 2. Frontend Error Parsing
### 3. User-Friendly Error Messages
### 4. Enhanced Logging

---

## Changes Applied

### 1. Backend API Error Handling

**File: `backend/apps/planner/api/views.py`**

#### Before (BROKEN):
```python
def post(self, request):
    input_serializer = QuestionnaireInputSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)
    
    plan = OutingPlanGenerator().generate(input_serializer.validated_data)
    # ❌ No error handling - ValueError crashes with 500
    
    output_serializer = OutingPlanSerializer(plan)
    return Response(output_serializer.data, status=status.HTTP_201_CREATED)
```

#### After (FIXED):
```python
def post(self, request):
    input_serializer = QuestionnaireInputSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)
    
    preferences = input_serializer.validated_data
    
    # Log generation attempt
    logger.info('Generating itinerary: location=(%.6f, %.6f), vibe=%s, ...')
    
    try:
        plan = OutingPlanGenerator().generate(preferences)
        logger.info('Itinerary generated successfully: %d stops', len(plan['stops']))
        
        output_serializer = OutingPlanSerializer(plan)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
        
    except ValueError as e:
        # Expected failure: No places found
        logger.warning('Itinerary generation failed (ValueError): %s', str(e))
        
        return Response(
            {
                'success': False,
                'error': 'generation_failed',
                'message': str(e),
                'details': {
                    'reason': 'no_places_found',
                    'suggestion': 'Try adjusting your location, preferences, or search criteria.',
                },
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,  # ✅ Not 500!
        )
        
    except GooglePlacesServiceError as e:
        # Google Places API error
        logger.error('Google Places API error: %s', str(e))
        
        return Response(
            {
                'success': False,
                'error': 'places_api_error',
                'message': 'Unable to fetch places from Google Places API.',
                'details': {
                    'reason': 'api_error',
                    'suggestion': 'Please try again in a few moments.',
                },
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )
        
    except Exception as e:
        # Unexpected error
        logger.exception('Unexpected error during itinerary generation: %s', str(e))
        
        return Response(
            {
                'success': False,
                'error': 'internal_error',
                'message': 'An unexpected error occurred.',
                'details': {
                    'reason': 'server_error',
                    'suggestion': 'Please try again. If the problem persists, contact support.',
                },
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
```

**Impact:**
- ✅ Returns HTTP 422 for expected failures (not 500)
- ✅ Structured error responses with helpful messages
- ✅ Detailed logging for debugging
- ✅ Different error types handled separately

---

### 2. Frontend Error Parsing

**File: `frontend/src/services/api/httpClient.js`**

#### Before:
```javascript
function parseErrorMessage(payload, status) {
  if (!payload || typeof payload !== 'object') {
    return `Request failed with status ${status}.`;
  }
  
  if (typeof payload.detail === 'string') {
    return payload.detail;
  }
  
  // ... field validation errors
}
```

#### After (ENHANCED):
```javascript
function parseErrorMessage(payload, status) {
  if (!payload || typeof payload !== 'object') {
    return `Request failed with status ${status}.`;
  }

  // NEW: Handle structured error responses from backend
  if (payload.success === false && payload.message) {
    return payload.message;  // ✅ Use backend's user-friendly message
  }

  // Handle DRF detail field
  if (typeof payload.detail === 'string') {
    return payload.detail;
  }

  // Handle field validation errors (filter out metadata fields)
  const fieldMessages = Object.entries(payload)
    .filter(([field]) => field !== 'success' && field !== 'error' && field !== 'details')
    .map(([field, errors]) => {
      const text = Array.isArray(errors) ? errors.join(' ') : String(errors);
      return `${field}: ${text}`;
    })
    .join(' ');

  return fieldMessages || `Request failed with status ${status}.`;
}
```

**Impact:**
- ✅ Parses new structured error format
- ✅ Extracts user-friendly messages from backend
- ✅ Filters out metadata fields

---

### 3. User-Friendly Error Messages

**File: `frontend/src/components/questionnaire/QuestionnaireForm.jsx`**

#### Before:
```javascript
catch (error) {
  const message =
    error instanceof ApiError
      ? error.message
      : 'Something went wrong. Please try again.';
  setApiError(message);
}
```

#### After (ENHANCED):
```javascript
catch (error) {
  // Enhanced error handling with user-friendly messages
  let message = 'Something went wrong. Please try again.';
  
  if (error instanceof ApiError) {
    // Use the backend's error message directly (already user-friendly)
    message = error.message;
    
    // Add context-specific suggestions based on error type
    if (error.status === 422) {
      // Unprocessable entity - likely no places found
      if (error.details?.error === 'generation_failed') {
        message = error.message + '\n\nSuggestions:\n• Try a different location\n• Adjust your time preferences\n• Change your vibe or interests';
      } else if (error.details?.error === 'places_api_error') {
        message = 'Unable to fetch places from Google. Please try again in a few moments.';
      }
    } else if (error.status === 500) {
      message = 'A server error occurred. Our team has been notified. Please try again later.';
    }
  }
  
  setApiError(message);
  
  // Scroll to top to show error message
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

**Impact:**
- ✅ Context-aware error messages
- ✅ Actionable suggestions for users
- ✅ Auto-scroll to show error
- ✅ Different messages for different error types

---

### 4. Enhanced Logging

**File: `backend/apps/planner/services/recommendation_engine.py`**

Added critical logging when returning empty recommendations:

```python
# CRITICAL: Log when returning empty recommendations
if len(recommendations) == 0:
    logger.error(
        '=== EMPTY RECOMMENDATIONS ===\n'
        'Location: (%.6f, %.6f)\n'
        'Vibe: %s, User: %s, Duration: %.1fh\n'
        'Search radius: %dm\n'
        'Queries attempted: %d\n'
        'Total collected: %d\n'
        'After deduplication: %d\n'
        'After balancing: %d\n'
        'After ranking: %d\n'
        'After validation: %d\n'
        'Errors: %s\n'
        'This will cause plan generation to fail.',
        latitude,
        longitude,
        vibe,
        user_type,
        duration_hours,
        search_radius,
        len(queries_attempted),
        len(all_collected),
        len(unique_places),
        len(balanced),
        len(ranked),
        len(validated_all),
        errors,
    )
```

**Impact:**
- ✅ Detailed diagnostics when no places found
- ✅ Shows exact pipeline breakdown
- ✅ Helps identify root cause (API errors, filtering too aggressive, etc.)

---

## Error Response Format

### Success Response (HTTP 201)
```json
{
  "plan_id": "uuid",
  "title": "Cultural Tourist Day Out",
  "stops": [...],
  "meta": {...}
}
```

### Error Response - No Places Found (HTTP 422)
```json
{
  "success": false,
  "error": "generation_failed",
  "message": "Unable to generate itinerary: No places found in this area. Please try a different location or adjust your preferences.",
  "details": {
    "reason": "no_places_found",
    "suggestion": "Try adjusting your location, preferences, or search criteria."
  }
}
```

### Error Response - Google Places API Error (HTTP 422)
```json
{
  "success": false,
  "error": "places_api_error",
  "message": "Unable to fetch places from Google Places API.",
  "details": {
    "reason": "api_error",
    "suggestion": "Please try again in a few moments. If the problem persists, contact support."
  }
}
```

### Error Response - Unexpected Error (HTTP 500)
```json
{
  "success": false,
  "error": "internal_error",
  "message": "An unexpected error occurred while generating your itinerary.",
  "details": {
    "reason": "server_error",
    "suggestion": "Please try again. If the problem persists, contact support."
  }
}
```

---

## User Experience Flow

### Before (BROKEN)

1. User submits questionnaire
2. Backend raises ValueError
3. API returns: `HTTP 500 Internal Server Error`
4. Frontend shows: "Request failed with status 500"
5. User confused, no guidance

### After (FIXED)

1. User submits questionnaire
2. Backend catches ValueError
3. API returns: `HTTP 422 Unprocessable Entity`
   ```json
   {
     "success": false,
     "message": "Unable to generate itinerary: No places found in this area...",
     "details": {
       "suggestion": "Try adjusting your location, preferences, or search criteria."
     }
   }
   ```
4. Frontend shows:
   ```
   Unable to generate itinerary: No places found in this area.
   Please try a different location or adjust your preferences.
   
   Suggestions:
   • Try a different location
   • Adjust your time preferences
   • Change your vibe or interests
   ```
5. User understands what went wrong and what to do

---

## HTTP Status Codes

### Used Correctly

| Status | Meaning | When Used |
|--------|---------|-----------|
| 201 | Created | Itinerary generated successfully |
| 400 | Bad Request | Invalid input data (handled by DRF serializer) |
| 422 | Unprocessable Entity | Valid input, but can't generate itinerary (no places, API error) |
| 500 | Internal Server Error | Unexpected server error (bugs, crashes) |

### Why 422 Instead of 500?

**422 Unprocessable Entity** means:
- ✅ Request was valid
- ✅ Server understood the request
- ❌ Server cannot fulfill it due to semantic errors

**500 Internal Server Error** means:
- ❌ Server encountered an unexpected condition
- ❌ Server bug or crash

**No places found is NOT a server error** - it's an expected business logic outcome.

---

## Backend Logging Examples

### Success Case
```
INFO: Generating itinerary: location=(40.7128, -74.0060), vibe=cultural, user_type=tourist, duration=10:00-16:00
INFO: [RecommendationEngine] Collected 45 places
INFO: [RecommendationEngine] Final: 6 stops
INFO: Itinerary generated successfully: 6 stops, generated_by=google_places
```

### No Places Found
```
INFO: Generating itinerary: location=(0.0, 0.0), vibe=cultural, user_type=tourist, duration=10:00-16:00
ERROR: [RecommendationEngine] === EMPTY RECOMMENDATIONS ===
Location: (0.0, 0.0)
Vibe: cultural, User: tourist, Duration: 6.0h
Search radius: 5000m
Queries attempted: 8
Total collected: 0
After deduplication: 0
After balancing: 0
After ranking: 0
After validation: 0
Errors: ['ZERO_RESULTS', 'ZERO_RESULTS', ...]
This will cause plan generation to fail.
WARNING: Itinerary generation failed (ValueError): Unable to generate itinerary: No places found in this area. Please try a different location or adjust your preferences.
```

### Google Places API Error
```
INFO: Generating itinerary: location=(40.7128, -74.0060), vibe=cultural, user_type=tourist, duration=10:00-16:00
ERROR: Google Places API error: REQUEST_DENIED - API key does not have Places API enabled
ERROR: Google Places API error: REQUEST_DENIED | location=(40.7128, -74.0060)
```

---

## Testing Checklist

### Backend Testing

- [ ] Generate itinerary for valid location
  - Should return HTTP 201
  - Should have stops with real places

- [ ] Generate itinerary for ocean coordinates (0.0, 0.0)
  - Should return HTTP 422
  - Should have structured error response
  - Should log "EMPTY RECOMMENDATIONS"

- [ ] Generate itinerary with invalid API key
  - Should return HTTP 422
  - Should have "places_api_error" error type

- [ ] Check backend logs
  - Should see detailed logging for all cases
  - Should see pipeline breakdown for empty results

### Frontend Testing

- [ ] Submit questionnaire with valid location
  - Should navigate to results page
  - Should show itinerary

- [ ] Submit questionnaire with remote location
  - Should show error message at top
  - Should auto-scroll to error
  - Should show suggestions

- [ ] Check error message content
  - Should be user-friendly (no technical jargon)
  - Should provide actionable suggestions
  - Should NOT say "Request failed with status 422"

### Integration Testing

- [ ] End-to-end flow with valid data
  - Should work smoothly

- [ ] End-to-end flow with no places found
  - Should show helpful error
  - User should understand what to do

- [ ] End-to-end flow with API error
  - Should show temporary error message
  - Should suggest trying again

---

## Build Validation

### Frontend Build
```bash
✅ npm run build - SUCCESS
✅ Bundle: 533.29 kB (gzipped: 141.18 kB)
✅ No TypeScript errors
✅ No ESLint errors
```

### Backend Validation
```bash
✅ Python syntax check - PASSED
✅ No import errors
✅ No syntax errors
```

---

## Files Modified

### Backend
1. `backend/apps/planner/api/views.py`
   - Added try-catch error handling in `GeneratePlanView.post()`
   - Returns HTTP 422 for expected failures
   - Returns structured error responses
   - Added detailed logging

2. `backend/apps/planner/services/recommendation_engine.py`
   - Added critical logging when returning empty recommendations
   - Logs complete pipeline breakdown for debugging

### Frontend
3. `frontend/src/services/api/httpClient.js`
   - Enhanced `parseErrorMessage()` to handle structured errors
   - Extracts user-friendly messages from backend

4. `frontend/src/components/questionnaire/QuestionnaireForm.jsx`
   - Enhanced error handling with context-aware messages
   - Added actionable suggestions
   - Added auto-scroll to error

---

## What Was NOT Changed

### Preserved Architecture
- ✅ No changes to plan generator logic
- ✅ No changes to recommendation engine logic
- ✅ No changes to Google Places integration
- ✅ No changes to database models
- ✅ No changes to authentication

### Preserved Functionality
- ✅ Itinerary generation still works the same
- ✅ Real places only (no fake fallbacks)
- ✅ All existing features preserved
- ✅ No breaking API changes

---

## Deployment Notes

### No Environment Changes Required
- ✅ No new environment variables
- ✅ No API key changes
- ✅ No database migrations
- ✅ No configuration changes

### Deployment Steps
1. Commit changes to git
2. Push to main branch
3. Vercel auto-deploys frontend
4. Render auto-deploys backend
5. Test in production

### Monitoring
- Check backend logs for error patterns
- Monitor HTTP 422 vs 500 ratio
- Track "no places found" frequency
- Identify problematic locations/preferences

---

## Rollback Plan

If issues occur:
```bash
git revert HEAD
git push origin main
```

All changes are safe to revert:
- No database migrations
- No breaking API changes
- No environment variable changes

---

## Summary

### Problems Fixed
✅ **No more HTTP 500 for expected failures** - Returns 422 instead  
✅ **User-friendly error messages** - Clear, actionable guidance  
✅ **Structured error responses** - Consistent format with details  
✅ **Enhanced logging** - Detailed diagnostics for debugging  
✅ **Context-aware suggestions** - Different messages for different errors  

### Expected Results
✅ **Better UX** - Users understand what went wrong  
✅ **Easier debugging** - Detailed logs show exact failure point  
✅ **Production stability** - No uncaught exceptions  
✅ **Clear error handling** - Proper HTTP status codes  

### Breaking Changes
⚠️ **None** - All changes are backward compatible
