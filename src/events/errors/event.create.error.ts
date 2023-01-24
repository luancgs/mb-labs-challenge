export class EventCreateError extends Error {
  constructor(message: string) {
    super(message);

    if (message.includes('CHK_contact')) {
      this.message = 'event must have at least one contact information';
    }
  }
}
