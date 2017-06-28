import { TestsPage } from './app.po';

describe('tests App', () => {
  let page: TestsPage;

  beforeEach(() => {
    page = new TestsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
