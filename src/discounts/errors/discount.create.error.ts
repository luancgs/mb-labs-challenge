export class DiscountCreateError extends Error {
  constructor(message: string) {
    super(message);

    if (message.includes('CHK_value')) {
      this.message = 'discount value should be a number between 1 and 100';
    } else if (message.includes('UNQ_code')) {
      this.message = 'discount code already exists';
    }
  }
}
