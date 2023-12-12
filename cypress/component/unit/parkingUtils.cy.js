import * as turf from '@turf/turf';
import {
    arePolygonsIntersecting,
    areParkingSpotsColliding,
    isSpotAreaTooBig,
    isSpotAreaTooSmall,
    getArea,
    convertToTurfPolygon  
} from '../../../src/utils/parkingUtils'; // Update with the correct path to your file

describe('Geometry functions', () => {

    it('should check if area is to big', () => {
        const parkingSpot = {
            pointsDTO: [
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 1 },
                { latitude: 1, longitude: 1 },
                { latitude: 1, longitude: 0 },
            ],
        };

        const result = isSpotAreaTooBig(parkingSpot);
        expect(result).to.be.true;
    }
    );

    it('should check if area is to small', () => {
        const parkingSpot = {
            pointsDTO: [
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 0 }, 
            ],
        };

        const result = isSpotAreaTooSmall(parkingSpot);
        expect(result).to.be.true;
    }
    );

    it('should check if parking spots are colliding', () => {
        const parkingSpot1 = {
            pointsDTO: [
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 1 },
                { latitude: 1, longitude: 1 },
                { latitude: 1, longitude: 0 },
            ],
        };

        const parkingSpot2 = {
            pointsDTO: [
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 1 },
                { latitude: 1, longitude: 1 },
                { latitude: 1, longitude: 0 },
            ],
        };

        const result = areParkingSpotsColliding(parkingSpot1, parkingSpot2);
        expect(result).to.be.true;
    }
    );
});
