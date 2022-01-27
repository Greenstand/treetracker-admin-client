import LoginPage from '../support/pages/LoginPage';

describe.only('Login', () => {
  const loginPage = new LoginPage();

  before(() => cy.fixture('login').then((login) => (globalThis.login = login)));

  it('displays an error message when "incorrect" credentials are entered', () => {
    loginPage.login('incorrectName', 'incorrectPassword');
    loginPage.expect_Displayed(login.error_message);
  });

  it('logs in when "correct" credentials are entered', () => {
    loginPage.login(login.user_name, login.password);
    cy.get('div.Home-menuAside-18').should('contain.text', 'Home');
  });

  it('can uncheck the Remember Me checkbox, which is checked by default', () => {
    cy.visit('/');
    cy.get('input[type="checkbox"]').should('be.checked');
    cy.get('input[type="checkbox"]').click().should('not.be.checked');
  });

  it('until one of the fields, user name or password, is empty, the button LOG IN will remain grayed out', () => {
    cy.visit('/');

    cy.get('input[id="userName"]').type('John');
    cy.get('input[id="userName"]').get('value').should('not.be.empty');
    cy.get('input[id="password"]').should('be.empty');
    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input[id="userName"]').clear().should('be.empty');
    cy.get('input[id="password"]').type('Secret Password');
    cy.get('input[id="password"]').get('value').should('not.be.empty');
    cy.get('button[type="submit"]').should('be.disabled');
  });
});

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains(/Log in/i);
    cy.findInputByLabel(/Username/i).type('testadmin');
    cy.findInputByLabel(/Password/i).type('testpwd');
    cy.contains(/log in/i).click();
  });

  it('Login successfully', () => {
    cy.contains(/Welcome/i);
  });

  describe('User Manager', () => {
    beforeEach(() => {
      cy.contains(/user manager/i).click();
    });

    it.skip('Edit', () => {
      //    cy.get("button[title=edit]")
      //      .click();
      cy.findRoleByText('listitem', 'admin').find('button[title=edit]').click();
      cy.contains('User Detail');
      cy.findInputByLabel('First Name').type('Dadior2');
      cy.findRoleByText('list', 'Roles')
        .contains('Admin')
        .should('not.visible');
      cy.findRoleByText('list', 'Selected').contains('Admin');
      cy.findRoleByText('list', 'Roles').contains('Tree Auditor').click();
      cy.contains('>').click();
      cy.contains(/save/i).click();
      cy.contains('User Detail').should('not.visible');
      cy.findRoleByText('listitem', 'Dadior2')
        .contains('Tree Auditor')
        .should('not.visible');
    });

    it('Password', () => {
      cy.findRoleByText('listitem', 'Dadior')
        .find("button[title='generate password']")
        .click();
      cy.findInputByLabel(/please input/i).type('admin');
      cy.contains('button', 'Generate').click();
    });

    it('Create', () => {
      cy.contains(/add user/i).click();
      cy.contains(/user detail/i);
      cy.findInputByLabel('Username').type('ezra');
      cy.findInputByLabel('First Name').type('Ezra');
      cy.findInputByLabel('Last Name').type('David');
      cy.findInputByLabel('Email').type('ezra@gmail.com');
      cy.findRoleByText('list', 'Roles').contains('Admin').click();
      cy.contains('>').click();
      cy.contains(/save/i).click();
    });
  });
});

describe.skip('Login with bbb', () => {
  before(() => {
    cy.visit('/');
    cy.contains(/Login/i);
    cy.findInputByLabel('userName').type('bbb');
    cy.findInputByLabel('password').type('123456');
    cy.contains(/login/i).click();
  });

  it('Login successfully', () => {
    cy.contains(/Welcome/i);
  });

  //  it.only("Test api, should be 401 or 200 cuz the role", () => {
  //    cy.request("GET", "http://localhost:3000/api/trees/count")
  //      .should(res => {
  //        expect(res.status).to.eq(200);
  //      });
  //    cy.request("GET", "http://localhost:3000/api/planter/count")
  //      .should(res => {
  //        expect(res.status).to.eq(401);
  //      });
  //  });
});
