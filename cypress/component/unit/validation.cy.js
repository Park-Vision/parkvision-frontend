import {
    validateEmail,
    validatePassword,
    validateName,
    validateRegistraionNumber,
} from '../../../src/utils/validation';

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

        expect(validateRegistraionNumber(uppercaseRegistrationNumber)).to.be.true;

        const emptyRegistrationNumber = '';

        expect(validateRegistraionNumber(emptyRegistrationNumber)).to.be.false;

        const registrationNumberWithSpecialChars = 'DLU123$5';

        expect(validateRegistraionNumber(registrationNumberWithSpecialChars)).to.be.false;
    });

    it('should validate name with latin unicode characters', () => {
        const danishName = 'ÆØÅ';
        const germanName = 'ÄÖÜß';
        const frenchName = 'àéèêëîïôœùûüÿç';
        const spanishName = 'áéíñóúü';
        const italianName = 'àèéìíîòóùú';
        const polishName = 'ąćęłńóśźż';
        const portugueseName = 'ãõâêôç';
        const romanianName = 'ăâîșț';
        const turkishName = 'çğıöşü';
        const czechName = 'čďěňřšťůž';
        const slovakName = 'áäčďéíĺľňóôŕšťúýž';
        const slovenianName = 'čšž';
        const hungarianName = 'áéíóöőúüű';
        const greekName = 'αβγδεζηθικλμνξοπρστυφχψω';
        const russianName = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const ukrainianName = 'єіїґ';
        const belarusianName = 'ў';
        const bulgarianName = 'ѝ';
        const macedonianName = 'ќѓѕ';
        const serbianName = 'ђћџ';
        const kazakhName = 'әғқңөұүһ';
        const mongolianName = 'өү';
        const chineseName = '你好';
        const japaneseName = 'こんにちは';
        const koreanName = '안녕하세요';
        const arabicName = 'مرحبا';
        const hebrewName = 'שלום';
        const xhosaName = 'Molo';
        const afrikaansName = 'Hallo';
        const swahiliName = 'Hujambo';
        const swedishName = 'ÅÄÖ';
        const norwegianName = 'ÆØÅ';
        const finnishName = 'ÄÖ';
        

        expect(validateName(danishName)).to.be.true;
        expect(validateName(germanName)).to.be.true;
        expect(validateName(frenchName)).to.be.true;
        expect(validateName(spanishName)).to.be.true;
        expect(validateName(italianName)).to.be.true;
        expect(validateName(polishName)).to.be.true;
        expect(validateName(portugueseName)).to.be.true;
        expect(validateName(romanianName)).to.be.true;
        expect(validateName(turkishName)).to.be.true;
        expect(validateName(czechName)).to.be.true;
        expect(validateName(slovakName)).to.be.true;
        expect(validateName(slovenianName)).to.be.true;
        expect(validateName(hungarianName)).to.be.true;
        expect(validateName(greekName)).to.be.true;
        expect(validateName(russianName)).to.be.true;
        expect(validateName(ukrainianName)).to.be.true;
        expect(validateName(belarusianName)).to.be.true;
        expect(validateName(bulgarianName)).to.be.true;
        expect(validateName(macedonianName)).to.be.true;
        expect(validateName(serbianName)).to.be.true;
        expect(validateName(kazakhName)).to.be.true;
        expect(validateName(mongolianName)).to.be.true;
        expect(validateName(chineseName)).to.be.true;
        expect(validateName(japaneseName)).to.be.true;
        expect(validateName(koreanName)).to.be.true;
        expect(validateName(arabicName)).to.be.true;
        expect(validateName(hebrewName)).to.be.true;
        expect(validateName(xhosaName)).to.be.true;
        expect(validateName(afrikaansName)).to.be.true;
        expect(validateName(swahiliName)).to.be.true;
        expect(validateName(swedishName)).to.be.true;
        expect(validateName(norwegianName)).to.be.true;
        expect(validateName(finnishName)).to.be.true;
    });
});
