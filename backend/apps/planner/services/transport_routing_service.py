"""
Transport-Aware Routing Service.

Provides realistic travel time estimates and route optimization based on:
- Transport mode (walking, public transit, bike, car, rideshare)
- Geographic distance
- Urban density
- Time of day
- Traffic patterns
"""

from __future__ import annotations

import logging
import math
from typing import Any

logger = logging.getLogger(__name__)

# Transport mode characteristics
TRANSPORT_MODE_CONFIG = {
    'walking': {
        'avg_speed_kmh': 4.5,  # Average walking speed
        'max_comfortable_distance_km': 2.0,  # Max comfortable walking distance
        'ideal_distance_km': 0.8,  # Ideal walking distance per leg
        'base_overhead_minutes': 2,  # Time to start/stop
        'per_km_overhead_minutes': 1,  # Additional time per km (stops, crossings)
    },
    'bike': {
        'avg_speed_kmh': 15.0,  # Average cycling speed
        'max_comfortable_distance_km': 8.0,  # Max comfortable cycling distance
        'ideal_distance_km': 3.0,  # Ideal cycling distance per leg
        'base_overhead_minutes': 3,  # Time to unlock/lock bike
        'per_km_overhead_minutes': 0.5,  # Additional time per km (stops, lights)
    },
    'public_transit': {
        'avg_speed_kmh': 25.0,  # Average transit speed (including waits)
        'max_comfortable_distance_km': 15.0,  # Max comfortable transit distance
        'ideal_distance_km': 5.0,  # Ideal transit distance per leg
        'base_overhead_minutes': 10,  # Wait time + walking to/from stops
        'per_km_overhead_minutes': 1,  # Additional time per km (stops)
    },
    'car': {
        'avg_speed_kmh': 35.0,  # Average urban driving speed
        'max_comfortable_distance_km': 40.0,  # Max comfortable driving distance
        'ideal_distance_km': 10.0,  # Ideal driving distance per leg
        'base_overhead_minutes': 8,  # Parking + walking
        'per_km_overhead_minutes': 0.3,  # Additional time per km (traffic)
    },
    'rideshare': {
        'avg_speed_kmh': 35.0,  # Average rideshare speed
        'max_comfortable_distance_km': 40.0,  # Max comfortable rideshare distance
        'ideal_distance_km': 10.0,  # Ideal rideshare distance per leg
        'base_overhead_minutes': 7,  # Wait for pickup + dropoff
        'per_km_overhead_minutes': 0.3,  # Additional time per km (traffic)
    },
}

# Search radius constraints by transport mode (in meters)
TRANSPORT_SEARCH_RADIUS = {
    'walking': {
        'min': 500,
        'ideal': 1500,
        'max': 2500,
    },
    'bike': {
        'min': 1500,
        'ideal': 4000,
        'max': 8000,
    },
    'public_transit': {
        'min': 3000,
        'ideal': 7000,
        'max': 12000,
    },
    'car': {
        'min': 5000,
        'ideal': 15000,
        'max': 40000,
    },
    'rideshare': {
        'min': 5000,
        'ideal': 15000,
        'max': 40000,
    },
}


class TransportRoutingService:
    """
    Transport-aware routing and travel time estimation service.
    
    Provides realistic travel time estimates and validates route feasibility
    based on transport mode and geographic constraints.
    """
    
    @staticmethod
    def calculate_haversine_distance(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
    ) -> float:
        """
        Calculate great-circle distance between two points using Haversine formula.
        
        Args:
            lat1, lon1: First point coordinates
            lat2, lon2: Second point coordinates
        
        Returns:
            Distance in kilometers
        """
        # Earth's radius in kilometers
        R = 6371.0
        
        # Convert to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Haversine formula
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        distance_km = R * c
        
        return distance_km
    
    @staticmethod
    def estimate_travel_time(
        from_location: dict[str, float],
        to_location: dict[str, float],
        transport_mode: str,
    ) -> int:
        """
        Estimate realistic travel time between two locations.
        
        Args:
            from_location: Dict with 'latitude' and 'longitude'
            to_location: Dict with 'latitude' and 'longitude'
            transport_mode: Transport mode (walking, bike, public_transit, car, rideshare)
        
        Returns:
            Travel time in minutes
        """
        # Calculate distance
        distance_km = TransportRoutingService.calculate_haversine_distance(
            from_location['latitude'],
            from_location['longitude'],
            to_location['latitude'],
            to_location['longitude'],
        )
        
        # Get transport mode config
        mode_config = TRANSPORT_MODE_CONFIG.get(transport_mode, TRANSPORT_MODE_CONFIG['public_transit'])
        
        # Calculate base travel time
        avg_speed = mode_config['avg_speed_kmh']
        base_time_minutes = (distance_km / avg_speed) * 60
        
        # Add overhead (waiting, parking, etc.)
        overhead_minutes = mode_config['base_overhead_minutes']
        overhead_minutes += distance_km * mode_config['per_km_overhead_minutes']
        
        # Total travel time
        total_time = base_time_minutes + overhead_minutes
        
        # Round to nearest 5 minutes for realism
        total_time = max(5, round(total_time / 5) * 5)
        
        logger.debug(
            'Travel time estimate: %.2f km via %s = %d minutes (base: %.1f, overhead: %.1f)',
            distance_km,
            transport_mode,
            total_time,
            base_time_minutes,
            overhead_minutes,
        )
        
        return int(total_time)
    
    @staticmethod
    def is_route_feasible(
        from_location: dict[str, float],
        to_location: dict[str, float],
        transport_mode: str,
    ) -> tuple[bool, str]:
        """
        Check if a route is feasible for the given transport mode.
        
        Args:
            from_location: Dict with 'latitude' and 'longitude'
            to_location: Dict with 'latitude' and 'longitude'
            transport_mode: Transport mode
        
        Returns:
            Tuple of (is_feasible, reason)
        """
        distance_km = TransportRoutingService.calculate_haversine_distance(
            from_location['latitude'],
            from_location['longitude'],
            to_location['latitude'],
            to_location['longitude'],
        )
        
        mode_config = TRANSPORT_MODE_CONFIG.get(transport_mode, TRANSPORT_MODE_CONFIG['public_transit'])
        max_distance = mode_config['max_comfortable_distance_km']
        
        if distance_km > max_distance:
            return False, f'Distance {distance_km:.1f}km exceeds comfortable {transport_mode} range ({max_distance}km)'
        
        return True, 'Route is feasible'
    
    @staticmethod
    def get_optimal_search_radius(
        transport_mode: str,
        duration_hours: float,
    ) -> int:
        """
        Get optimal search radius for recommendations based on transport mode and duration.
        
        Args:
            transport_mode: Transport mode
            duration_hours: Outing duration in hours
        
        Returns:
            Search radius in meters
        """
        radius_config = TRANSPORT_SEARCH_RADIUS.get(
            transport_mode,
            TRANSPORT_SEARCH_RADIUS['public_transit'],
        )
        
        # Base radius on duration
        if duration_hours <= 3:
            # Short outing: use min-ideal range
            base_radius = radius_config['min']
        elif duration_hours <= 6:
            # Medium outing: use ideal radius
            base_radius = radius_config['ideal']
        else:
            # Long outing: use ideal-max range
            base_radius = int((radius_config['ideal'] + radius_config['max']) / 2)
        
        # Clamp to min/max
        radius = max(radius_config['min'], min(radius_config['max'], base_radius))
        
        logger.info(
            'Optimal search radius for %s (%.1fh): %dm (range: %d-%d)',
            transport_mode,
            duration_hours,
            radius,
            radius_config['min'],
            radius_config['max'],
        )
        
        return radius
    
    @staticmethod
    def calculate_route_efficiency(
        stops: list[dict[str, Any]],
        transport_mode: str,
    ) -> dict[str, Any]:
        """
        Calculate route efficiency metrics for a sequence of stops.
        
        Args:
            stops: List of stops with 'location' dict
            transport_mode: Transport mode
        
        Returns:
            Dict with efficiency metrics
        """
        if len(stops) < 2:
            return {
                'total_distance_km': 0.0,
                'total_travel_time_minutes': 0,
                'avg_distance_per_leg_km': 0.0,
                'max_distance_per_leg_km': 0.0,
                'efficiency_score': 1.0,
                'is_efficient': True,
                'warnings': [],
            }
        
        total_distance = 0.0
        total_travel_time = 0
        distances = []
        warnings = []
        
        for i in range(len(stops) - 1):
            from_stop = stops[i]
            to_stop = stops[i + 1]
            
            if not from_stop.get('location') or not to_stop.get('location'):
                continue
            
            distance = TransportRoutingService.calculate_haversine_distance(
                from_stop['location']['latitude'],
                from_stop['location']['longitude'],
                to_stop['location']['latitude'],
                to_stop['location']['longitude'],
            )
            
            travel_time = TransportRoutingService.estimate_travel_time(
                from_stop['location'],
                to_stop['location'],
                transport_mode,
            )
            
            total_distance += distance
            total_travel_time += travel_time
            distances.append(distance)
            
            # Check for inefficient legs
            mode_config = TRANSPORT_MODE_CONFIG.get(transport_mode, TRANSPORT_MODE_CONFIG['public_transit'])
            if distance > mode_config['max_comfortable_distance_km']:
                warnings.append(
                    f"Leg {i+1}→{i+2}: {distance:.1f}km exceeds comfortable {transport_mode} range"
                )
        
        avg_distance = total_distance / len(distances) if distances else 0.0
        max_distance = max(distances) if distances else 0.0
        
        # Calculate efficiency score (0-1, higher is better)
        mode_config = TRANSPORT_MODE_CONFIG.get(transport_mode, TRANSPORT_MODE_CONFIG['public_transit'])
        ideal_distance = mode_config['ideal_distance_km']
        
        # Efficiency based on how close average distance is to ideal
        if avg_distance <= ideal_distance:
            efficiency_score = 1.0
        else:
            # Penalize distances beyond ideal
            efficiency_score = max(0.0, 1.0 - (avg_distance - ideal_distance) / ideal_distance)
        
        is_efficient = efficiency_score >= 0.6 and len(warnings) == 0
        
        return {
            'total_distance_km': round(total_distance, 2),
            'total_travel_time_minutes': total_travel_time,
            'avg_distance_per_leg_km': round(avg_distance, 2),
            'max_distance_per_leg_km': round(max_distance, 2),
            'efficiency_score': round(efficiency_score, 2),
            'is_efficient': is_efficient,
            'warnings': warnings,
        }
    
    @staticmethod
    def optimize_stop_order(
        stops: list[dict[str, Any]],
        start_location: dict[str, float],
        transport_mode: str,
    ) -> list[dict[str, Any]]:
        """
        Optimize stop order to minimize travel distance (simple nearest-neighbor).
        
        Args:
            stops: List of stops with 'location' dict
            start_location: Starting location dict with 'latitude' and 'longitude'
            transport_mode: Transport mode
        
        Returns:
            Reordered list of stops
        """
        if len(stops) <= 2:
            return stops
        
        # Simple nearest-neighbor optimization
        optimized = []
        remaining = stops.copy()
        current_location = start_location
        
        while remaining:
            # Find nearest stop to current location
            nearest_stop = None
            nearest_distance = float('inf')
            
            for stop in remaining:
                if not stop.get('location'):
                    continue
                
                distance = TransportRoutingService.calculate_haversine_distance(
                    current_location['latitude'],
                    current_location['longitude'],
                    stop['location']['latitude'],
                    stop['location']['longitude'],
                )
                
                if distance < nearest_distance:
                    nearest_distance = distance
                    nearest_stop = stop
            
            if nearest_stop:
                optimized.append(nearest_stop)
                remaining.remove(nearest_stop)
                current_location = nearest_stop['location']
            else:
                # No location data, just append
                optimized.extend(remaining)
                break
        
        logger.info(
            'Optimized stop order for %s: %d stops reordered',
            transport_mode,
            len(stops),
        )
        
        return optimized
