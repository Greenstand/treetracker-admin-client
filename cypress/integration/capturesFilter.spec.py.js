import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import CapturesPage from '../support/pages/CapturesPage';

describe('Captures Filter', () => {
  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const captures_Page = new CapturesPage();

  before(() => cy.fixture('login').then((login) => (globalThis.login = login)));

  beforeEach(() => {
    login_Page.login(login.user_name, login.password);
    home_Page.captures_Button().click();
    captures_Page.captures_TableRows().should('be.visible');
  });

  it('displayes one of the status options "Approved, Awaiting Verification, Rejected" in the Verification Status column when "Select All" option in the "Verification Status" dropdownmenu is checked', () => {
    captures_Page
      .open_VerificationStatus_DropdownMenu()
      .and()
      .check_VerificationStatus('Select All')
      .then()
      .shouldBe_Checked('Approved')
      .shouldBe_Checked('Awaiting Verification')
      .shouldBe_Checked('Rejected')
      .and()
      .click_button_Apply()
      .then()
      .verificationStatus_Column_ShouldContainOneOf(
        'Approved',
        'Awaiting Verification',
        'Rejected'
      );
  });

  it('displayes one of the status options "Approved" or "Awaiting Verification" in the Verification Status column when "Approved" and "Awaiting Verification" options in the "Verification Status" dropdownmenu are checked', () => {
    captures_Page
      .open_VerificationStatus_DropdownMenu()
      .and()
      .check_VerificationStatus('Approved')
      .check_VerificationStatus('Awaiting Verification')
      .uncheck_VerificationStatus('Rejected')
      .and()
      .click_button_Apply()
      .then()
      .verificationStatus_Column_ShouldContainOneOf(
        'Approved',
        'Awaiting Verification'
      );
  });
  it('displayes one of the status options "Awaiting Verification" or "Rejected" in the Verification Status column when "Awaiting Verification" and "Rejected" options in the "Verification Status" dropdownmenu are checked', () => {
    captures_Page
      .open_VerificationStatus_DropdownMenu()
      .and()
      .uncheck_VerificationStatus('Approved')
      .check_VerificationStatus('Awaiting Verification')
      .check_VerificationStatus('Rejected')
      .and()
      .click_button_Apply()
      .then()
      .verificationStatus_Column_ShouldContainOneOf(
        'Rejected',
        'Awaiting Verification'
      );
  });
  it('displayes one of the status options "Approved" or "Rejected" in the Verification Status column when "Approved" and "Rejected" options in the "Verification Status" dropdownmenu are checked', () => {
    captures_Page
      .open_VerificationStatus_DropdownMenu()
      .and()
      .check_VerificationStatus('Approved')
      .uncheck_VerificationStatus('Awaiting Verification')
      .check_VerificationStatus('Rejected')
      .and()
      .click_button_Apply()
      .then()
      .verificationStatus_Column_ShouldContainOneOf('Approved', 'Rejected');
  });
  it('displayes only "Approved" as the status option in the Verification Status column when only "Approved" option in the "Verification Status" dropdownmenu is checked', () => {
    captures_Page
      .open_VerificationStatus_DropdownMenu()
      .and()
      .check_VerificationStatus('Approved')
      .uncheck_VerificationStatus('Awaiting Verification')
      .uncheck_VerificationStatus('Rejected')
      .and()
      .click_button_Apply()
      .then()
      .verificationStatus_Column_ShouldContainOnly('Approved');
  });

  it('displayes only "Awaiting Verification" as the status option in the Verification Status column when only "Awaiting Verification" option in the "Verification Status" dropdownmenu is checked', () => {
    captures_Page
      .open_VerificationStatus_DropdownMenu()
      .and()
      .uncheck_VerificationStatus('Approved')
      .check_VerificationStatus('Awaiting Verification')
      .uncheck_VerificationStatus('Rejected')
      .and()
      .click_button_Apply()
      .then()
      .verificationStatus_Column_ShouldContainOnly('Awaiting Verification');
  });

  it('displayes only "Rejected" as the status option in the Verification Status column when only "Rejected" option in the "Verification Status" dropdownmenu is checked', () => {
    captures_Page
      .open_VerificationStatus_DropdownMenu()
      .and()
      .uncheck_VerificationStatus('Approved')
      .uncheck_VerificationStatus('Awaiting Verification')
      .check_VerificationStatus('Rejected')
      .and()
      .click_button_Apply()
      .then()
      .verificationStatus_Column_ShouldContainOnly('Rejected');
  });
});
