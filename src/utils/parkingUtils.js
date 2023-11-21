import * as turf from '@turf/turf';
function convertToTurfPolygon(points) {
    const coordinates = points.map(point => [point.longitude, point.latitude]);
    coordinates.push(coordinates[0]);
    return turf.polygon([coordinates]);
}

export function arePolygonsIntersecting(polygon1, polygon2) {
    return turf.intersect(polygon1, polygon2);
}


export function areParkingSpotsColliding(parkingSpot1, parkingSpot2) {
    const polygon1 = convertToTurfPolygon(parkingSpot1.pointsDTO);
    const polygon2 = convertToTurfPolygon(parkingSpot2.pointsDTO);

    if (arePolygonsIntersecting(polygon1, polygon2) === null) {
        return false;
    }
    return true
}

export function isSpotAreaTooBig(parkingSpot) {
    const polygon1 = convertToTurfPolygon(parkingSpot.pointsDTO);

    const area = turf.area(polygon1);
    if (area > 12.5) {
        return true;
    }

    return false;
}

export function isSpotAreaTooSmall(parkingSpot) {
    const polygon1 = convertToTurfPolygon(parkingSpot.pointsDTO);

    const area = turf.area(polygon1);
    if (area < 8) {
        return true;
    }

    return false;
}

export function getArea(parkingSpot) {
    const polygon1 = convertToTurfPolygon(parkingSpot.pointsDTO);

    const area = turf.area(polygon1);
    return area;
}