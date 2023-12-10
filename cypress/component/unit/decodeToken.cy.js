import decodeToken from '../../../src/utils/decodeToken';

describe('decodeToken', () => {
    it('returns null for invalid token types', () => {
        const invalidToken = 123; // Not a string
        const result = decodeToken(invalidToken);
        expect(result).to.be.null;
    });

    it('returns null for empty or falsy tokens', () => {
        const emptyToken = '';
        const resultEmpty = decodeToken(emptyToken);
        expect(resultEmpty).to.be.null;

        const nullToken = null;
        const resultNull = decodeToken(nullToken);
        expect(resultNull).to.be.null;
    });

    it('returns null for tokens with incorrect number of parts', () => {
        const invalidToken = 'part1.part2'; // Missing the third part
        const result = decodeToken(invalidToken);
        expect(result).to.be.null;
    });

    it('returns the decoded token for valid tokens', () => {
        const validToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        const result = decodeToken(validToken);

        const expectedDecodedToken = {
            sub: '1234567890',
            name: 'John Doe',
            iat: 1516239022,
        };

        expect(JSON.stringify(result)).to.equal(JSON.stringify(expectedDecodedToken));
    });

});
