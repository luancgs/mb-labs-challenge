export class AdminUpdateError extends Error {
  constructor(message: string) {
    super(message);

    if (message.includes('UNQ_email')) {
      this.message = 'email already registered';
    }
  }
}
