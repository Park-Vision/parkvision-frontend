import {
    validateEmail,
    validatePassword,
    validateName,
    validateRegistraionNumber,
} from '../../src/utils/validation';

describe('Validation Functions', () => {
    it('should validate email', () => {
        const validEmail = 'test@example.com';
        const invalidEmail = 'invalid-email';

        expect(validateEmail(validEmail)).to.be.true;
        expect(validateEmail(invalidEmail)).to.be.false;

        const emptyEmail = '';
        const specialCharactersEmail = 'test@exa$mple.com';

        expect(validateEmail(emptyEmail)).to.be.false;
        expect(validateEmail(specialCharactersEmail)).to.be.false;
    });

    it('should validate password', () => {
        const validPassword = 'Password1!';
        const invalidPassword = 'invalid';
        const tooShortPassword = 'Pass1!';

        expect(validatePassword(validPassword)).to.be.true;
        expect(validatePassword(invalidPassword)).to.be.false;
        expect(validatePassword(tooShortPassword)).to.be.false;

        const noUppercasePassword = 'password1!';
        const noSpecialCharPassword = 'Password123';
        const validPasswordWithSpaces = ' Password1! ';

        expect(validatePassword(noUppercasePassword)).to.be.false;
        expect(validatePassword(noSpecialCharPassword)).to.be.false;
        expect(validatePassword(validPasswordWithSpaces)).to.be.false;
    });

    it('should validate name', () => {
        const validName = 'John';
        const invalidName = '';

        expect(validateName(validName)).to.be.true;
        expect(validateName(invalidName)).to.be.false;

        const nameWithNumbers = 'John123';
        const nameWithSpecialChars = 'John$';

        expect(validateName(nameWithNumbers)).to.be.false;
        expect(validateName(nameWithSpecialChars)).to.be.false;

        const nameWithSpaces = 'John Doe';

        expect(validateName(nameWithSpaces)).to.be.false;
    });

    it('should validate registration number', () => {
        const validRegistrationNumber = 'DLU12345';
        const invalidRegistrationNumber = 'Z 123 45';

        expect(validateRegistraionNumber(validRegistrationNumber)).to.be.true;
        expect(validateRegistraionNumber(invalidRegistrationNumber)).to.be.false;

        const uppercaseRegistrationNumber = 'ABC12345';
        const mixedCaseRegistrationNumber = 'DlU67890';

        expect(validateRegistraionNumber(uppercaseRegistrationNumber)).to.be.true;
        expect(validateRegistraionNumber(mixedCaseRegistrationNumber)).to.be.false;

        const emptyRegistrationNumber = '';

        expect(validateRegistraionNumber(emptyRegistrationNumber)).to.be.false;

        const registrationNumberWithSpecialChars = 'DLU123$5';

        expect(validateRegistraionNumber(registrationNumberWithSpecialChars)).to.be.false;
    });
});
