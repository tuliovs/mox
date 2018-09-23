import { KarnModule } from '@karn/karn.module';

describe('KarnModule', () => {
  let karnModule: KarnModule;

  beforeEach(() => {
    karnModule = new KarnModule();
  });

  it('should create an instance', () => {
    expect(karnModule).toBeTruthy();
  });
});
