import { DownloadDirective } from './download.directive';
import { APIService } from '../services/api.service';

class FakeApi {
  constructor() {

  }
}

describe('DownloadDirective', () => {
  it('should create an instance', () => {
    const fakeApi = new FakeApi();
    const directive = new DownloadDirective(<APIService>fakeApi);
    expect(directive).toBeTruthy();
  });
});
