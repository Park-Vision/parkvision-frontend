import convertTime from '../../../src/utils/convertTime';

describe('convertTime Function', () => {
    it('should convert a valid time string with a positive timezone offset', () => {
        const inputTime = '12:34Z';
        const timezoneOffset = '+02:00'; 
        const expectedResult = '14:34';

        expect(convertTime(inputTime, timezoneOffset)).to.equal(expectedResult);
    });

    it('should convert a valid time string with a negative timezone offset', () => {
        const inputTime = '12:34Z';
        const timezoneOffset = '-02:00'; 
        const expectedResult = '10:34';

        expect(convertTime(inputTime, timezoneOffset)).to.equal(expectedResult);

    });

    it('should return null for an empty time string', () => {
        const inputTime = '';
        const timezoneOffset = '+02:00';

        expect(convertTime(inputTime, timezoneOffset)).to.be.null;
    });

    it('should return null for an undefined timezone offset', () => {
        const inputTime = '12:34Z';
        const timezoneOffset = undefined;

        expect(convertTime(inputTime, timezoneOffset)).to.be.null;
    });

    it('should handle a time string with +00:00 offset', () => {
        const inputTime = '12:34Z';
        const timezoneOffset = '+00:00';
        const expectedResult = '12:34';

        expect(convertTime(inputTime, timezoneOffset)).to.equal(expectedResult);
    });

    it('should handle a time string with a leading zero in the hour', () => {
        const inputTime = '01:34Z';
        const timezoneOffset = '+00:00';
        const expectedResult = '01:34';

        expect(convertTime(inputTime, timezoneOffset)).to.equal(expectedResult);
    });

    it('should handle a time string with a leading zero in the minute', () => {
        const inputTime = '12:03Z';
        const timezoneOffset = '+00:00';
        const expectedResult = '12:03';

        expect(convertTime(inputTime, timezoneOffset)).to.equal(expectedResult);
    });

    it('should handle a time string with a leading zero in the hour and minute', () => {
        const inputTime = '01:03Z';
        const timezoneOffset = '+00:00';
        const expectedResult = '01:03';

        expect(convertTime(inputTime, timezoneOffset)).to.equal(expectedResult);
    });

    it('should handle a time string with a negative timezone offset', () => {
        const inputTime = '12:34Z';
        const timezoneOffset = '-02:00';
        const expectedResult = '10:34';

        expect(convertTime(inputTime, timezoneOffset)).to.equal(expectedResult);
    });
});
