import { PickAndGo.Web.SPAPage } from './app.po';

describe('pick-and-go.web.spa App', () => {
  let page: PickAndGo.Web.SPAPage;

  beforeEach(() => {
    page = new PickAndGo.Web.SPAPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
