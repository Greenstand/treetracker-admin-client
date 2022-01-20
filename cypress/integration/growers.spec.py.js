import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import GrowersPage from '../support/pages/GrowersPage';

describe('Growers', () => {
  const growersPerPage = 24;

  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const growers_Page = new GrowersPage();

  before(() => cy.fixture('login').then((login) => (globalThis.login = login)));

  beforeEach(() => {
    login_Page.login(login.user_name, login.password);
    home_Page.growers_Button().click();
  });

  it(`displays ${growersPerPage} of grower cards per page`, () => {
    growers_Page.grower_Card().should('have.length', growersPerPage);
  });

  describe('Grower Card', () => {
    beforeEach(() => growers_Page.grower_Image());
    it('displays user name formated as: "Name Surname" on the bottom of the grower card', () => {
      growers_Page.grower_Name().contains(/[A-Z]\w+ [A-Z]\w+/);
    });
    it('displays user id formated as: "ID: 1234" on the bottom of the grower card', () => {
      growers_Page.grower_ID().contains(/ID: \d+/);
    });
    it('displays organization name id formated as: "Organization" on the bottom of the grower card', () => {
      growers_Page.grower_OrganizationName().contains(/[A-Z]\w+/);
    });
  });

  describe('Pagination', () => {
    it('shows the number of items per page formated as: "1-24 of 5255"', () => {
      growers_Page
        .pagination()
        .contains(new RegExp(`^1-${growersPerPage} of \\d+`))
        .should('be.visible');
    });
  });

  describe('First page', () => {
    it('disables the "Previous page" button as long as the first page is displayed', () => {
      growers_Page.pagination().should('contain.text', `1-${growersPerPage}`);
      growers_Page.previousPage_Button().should('be.disabled');
    });
  });

  describe('Second page', () => {
    beforeEach(() => growers_Page.nextPage_Button().first().click());
    it('enables the "Previous page" button when the second page is displayed', () => {
      growers_Page
        .pagination()
        .should('contain.text', `${growersPerPage + 1}-${growersPerPage * 2}`);
      growers_Page.previousPage_Button().should('be.enabled');
    });
  });
});
