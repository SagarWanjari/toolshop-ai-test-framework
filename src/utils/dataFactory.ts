import { faker } from '@faker-js/faker';
import { CheckoutData, User } from '@types-custom/index';

export const DataFactory = {

  validCheckoutData(): CheckoutData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'United States',
      postcode: faker.location.zipCode('#####'),
      paymentType: 'bank-transfer',
    };
  },

  invalidCheckoutData(missingField: keyof CheckoutData): CheckoutData {
    const valid = this.validCheckoutData();
    return { ...valid, [missingField]: '' };
  },

  randomEmail(): string {
    return faker.internet.email({ provider: 'test.com' });
  },

  randomPassword(): string {
    return faker.internet.password({ length: 12, memorable: false });
  },

  randomProductQuantity(min = 1, max = 5): number {
    return faker.number.int({ min, max });
  },

  edgeCaseStrings(): string[] {
    return [
      '',
      ' ',
      'a'.repeat(256),
      '<script>alert("xss")</script>',
      "'; DROP TABLE users; --",
      '🔥🎯💻',
      '\n\t\r',
      '0',
      '-1',
    ];
  },

};