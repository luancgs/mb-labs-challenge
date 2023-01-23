import { Organizer } from './organizer.entity';

describe('Organizer', () => {
  it('should be defined', () => {
    expect(new Organizer()).toBeDefined();
  });

  it('should be initalized empty', () => {
    const organizer = new Organizer();

    expect(organizer).toEqual({});
    expect(organizer).toBeInstanceOf(Organizer);
  });
});
