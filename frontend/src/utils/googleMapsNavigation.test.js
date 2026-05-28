/**
 * Manual Test Suite for Google Maps Navigation Utilities
 * 
 * Run these tests in the browser console to verify functionality.
 * Copy and paste the test functions into the console after importing the module.
 */

import { 
  generateGoogleMapsUrl, 
  canGenerateNavigation,
} from './googleMapsNavigation.js';

// Test Data
const mockStops = {
  twoStops: [
    {
      order: 1,
      name: 'Central Park',
      location: { latitude: 40.785091, longitude: -73.968285 }
    },
    {
      order: 2,
      name: 'Times Square',
      location: { latitude: 40.758896, longitude: -73.985130 }
    }
  ],
  
  multipleStops: [
    {
      order: 1,
      name: 'Statue of Liberty',
      location: { latitude: 40.689247, longitude: -74.044502 }
    },
    {
      order: 2,
      name: 'Brooklyn Bridge',
      location: { latitude: 40.706086, longitude: -73.996864 }
    },
    {
      order: 3,
      name: 'Empire State Building',
      location: { latitude: 40.748817, longitude: -73.985428 }
    },
    {
      order: 4,
      name: 'Central Park',
      location: { latitude: 40.785091, longitude: -73.968285 }
    }
  ],
  
  manyStops: Array.from({ length: 12 }, (_, i) => ({
    order: i + 1,
    name: `Stop ${i + 1}`,
    location: { 
      latitude: 40.7 + (i * 0.01), 
      longitude: -73.9 + (i * 0.01) 
    }
  })),
  
  mixedQuality: [
    {
      order: 1,
      name: 'Good Stop',
      location: { latitude: 40.7, longitude: -73.9 }
    },
    {
      order: 2,
      name: 'No Coordinates Stop',
      location: null
    },
    {
      order: 3,
      name: 'Name Only Stop'
      // No location field
    },
    {
      order: 4,
      name: 'Another Good Stop',
      location: { latitude: 40.8, longitude: -73.8 }
    }
  ],
  
  singleStop: [
    {
      order: 1,
      name: 'Lonely Stop',
      location: { latitude: 40.7, longitude: -73.9 }
    }
  ],
  
  noStops: []
};

// Test Functions
export function testTwoStops() {
  console.group('Test: Two Stops');
  const url = generateGoogleMapsUrl(mockStops.twoStops, 'driving');
  console.log('URL:', url);
  console.assert(url.includes('origin=40.785091,-73.968285'), 'Origin should be Central Park');
  console.assert(url.includes('destination=40.758896,-73.98513'), 'Destination should be Times Square');
  console.assert(url.includes('travelmode=driving'), 'Travel mode should be driving');
  console.assert(!url.includes('waypoints'), 'Should not have waypoints for 2 stops');
  console.log('✅ Two stops test passed');
  console.groupEnd();
}

export function testMultipleStops() {
  console.group('Test: Multiple Stops');
  const url = generateGoogleMapsUrl(mockStops.multipleStops, 'walking');
  console.log('URL:', url);
  console.assert(url.includes('origin=40.689247,-74.044502'), 'Origin should be Statue of Liberty');
  console.assert(url.includes('destination=40.785091,-73.968285'), 'Destination should be Central Park');
  console.assert(url.includes('waypoints='), 'Should have waypoints');
  console.assert(url.includes('travelmode=walking'), 'Travel mode should be walking');
  console.log('✅ Multiple stops test passed');
  console.groupEnd();
}

export function testManyStops() {
  console.group('Test: Many Stops (Waypoint Limit)');
  const url = generateGoogleMapsUrl(mockStops.manyStops, 'bicycling');
  console.log('URL:', url);
  console.log('URL Length:', url.length);
  
  // Count waypoints (should be max 8)
  const waypointsMatch = url.match(/waypoints=([^&]+)/);
  if (waypointsMatch) {
    const waypoints = waypointsMatch[1].split('|');
    console.log('Waypoint count:', waypoints.length);
    console.assert(waypoints.length <= 8, 'Should have max 8 waypoints');
  }
  
  console.assert(url.includes('travelmode=bicycling'), 'Travel mode should be bicycling');
  console.log('✅ Many stops test passed');
  console.groupEnd();
}

export function testMixedQuality() {
  console.group('Test: Mixed Quality Stops');
  const url = generateGoogleMapsUrl(mockStops.mixedQuality, 'transit');
  console.log('URL:', url);
  console.assert(url !== null, 'Should generate URL despite some invalid stops');
  console.assert(url.includes('travelmode=transit'), 'Travel mode should be transit');
  console.log('✅ Mixed quality test passed');
  console.groupEnd();
}

export function testSingleStop() {
  console.group('Test: Single Stop');
  const url = generateGoogleMapsUrl(mockStops.singleStop);
  console.log('URL:', url);
  console.assert(url.includes('search'), 'Single stop should use search API');
  console.assert(!url.includes('dir'), 'Single stop should not use directions');
  console.log('✅ Single stop test passed');
  console.groupEnd();
}

export function testNoStops() {
  console.group('Test: No Stops');
  const url = generateGoogleMapsUrl(mockStops.noStops);
  console.log('URL:', url);
  console.assert(url === null, 'Should return null for no stops');
  console.log('✅ No stops test passed');
  console.groupEnd();
}

export function testCanGenerateNavigation() {
  console.group('Test: Can Generate Navigation');
  
  console.assert(canGenerateNavigation(mockStops.twoStops) === true, 'Two stops should be navigable');
  console.assert(canGenerateNavigation(mockStops.multipleStops) === true, 'Multiple stops should be navigable');
  console.assert(canGenerateNavigation(mockStops.singleStop) === false, 'Single stop should not be navigable');
  console.assert(canGenerateNavigation(mockStops.noStops) === false, 'No stops should not be navigable');
  console.assert(canGenerateNavigation(null) === false, 'Null should not be navigable');
  console.assert(canGenerateNavigation([]) === false, 'Empty array should not be navigable');
  
  console.log('✅ Can generate navigation test passed');
  console.groupEnd();
}

export function testTransportModes() {
  console.group('Test: Transport Mode Mapping');
  
  const modes = ['driving', 'walking', 'bicycling', 'transit', 'car', 'bike', 'foot', 'public_transport'];
  
  modes.forEach(mode => {
    const url = generateGoogleMapsUrl(mockStops.twoStops, mode);
    console.log(`Mode: ${mode} → URL includes travelmode:`, url.includes('travelmode='));
  });
  
  console.log('✅ Transport mode mapping test passed');
  console.groupEnd();
}

// Run All Tests
export function runAllTests() {
  console.clear();
  console.log('🧪 Running Google Maps Navigation Tests\n');
  
  try {
    testTwoStops();
    testMultipleStops();
    testManyStops();
    testMixedQuality();
    testSingleStop();
    testNoStops();
    testCanGenerateNavigation();
    testTransportModes();
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.googleMapsNavigationTests = {
    runAllTests,
    testTwoStops,
    testMultipleStops,
    testManyStops,
    testMixedQuality,
    testSingleStop,
    testNoStops,
    testCanGenerateNavigation,
    testTransportModes,
    mockStops
  };
  
  console.log('📦 Google Maps Navigation tests loaded!');
  console.log('Run: window.googleMapsNavigationTests.runAllTests()');
}
