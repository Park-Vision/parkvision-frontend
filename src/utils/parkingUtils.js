import * as turf from '@turf/turf';

const minmalArea = parseInt(process.env.REACT_APP_MINIMAL_AREA);
const maximalArea = parseInt(process.env.REACT_APP_MAXIMAL_AREA);

export function convertToTurfPolygon(points) {
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
    if (area > maximalArea) {
        return true;
    }

    return false;
}

export function isSpotAreaTooSmall(parkingSpot) {
    const polygon1 = convertToTurfPolygon(parkingSpot.pointsDTO);
    const area = turf.area(polygon1);
    if (area < minmalArea) {
        return true;
    }

    return false;
}

export function getArea(parkingSpot) {
    const polygon1 = convertToTurfPolygon(parkingSpot.pointsDTO);

    const area = turf.area(polygon1);
    return area;
}