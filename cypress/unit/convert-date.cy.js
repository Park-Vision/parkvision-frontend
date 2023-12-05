import { convertDate } from '../../src/utils/convertDate'

describe('convertDate Function', () => {
    it('should convert a valid date string to local date string with default timezone offset', () => {
        const inputDate = '2023-01-01T12:34:56+00:00';
        const expectedResult = '2023-01-01T12:34:56'
        const expectedResultDate = new Date(expectedResult).toISOString();
        
        expect(convertDate(inputDate)).to.equal(expectedResultDate);
    });

    it('should return null for an empty date string', () => {
        const inputDate = '';
        expect(convertDate(inputDate)).to.be.null;
    });

    it('should handle a valid date string with a specified positive timezone offset', () => {
        const inputDate = '2023-01-01T12:34:56+01:00';
        const expectedResult = '2023-01-01T12:34:56'
        const expectedResultDate = new Date(expectedResult);

        expect(convertDate(inputDate)).to.equal(expectedResultDate.toISOString());
    });

    it('should handle valid date string with specified negative -12:00 timezone offset', () => {
        const inputDate = '2023-01-01T12:34:56-12:00';
        const expectedDate = '2023-01-01T12:34:56';
        const expectedResult = new Date(expectedDate).toISOString();

        expect(convertDate(inputDate)).to.equal(expectedResult);
    });

    it('should handle valid date string with specified UTC timezone offset', () => {
        const inputDate = '2023-01-01T12:34:56Z';
        const expectedDate = '2023-01-01T12:34:56';
        const expectedResult = new Date(expectedDate).toISOString();

        expect(convertDate(inputDate)).to.equal(expectedResult);
    });
});
