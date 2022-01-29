import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';
import CapturesPage from '../support/pages/CapturesPage';

describe('Captures Filter', () => {
  const login_Page = new LoginPage();
  const home_Page = new HomePage();
  const captures_Page = new CapturesPage();

  describe('Verification Status dropdown menu', () => {
    beforeEach(() => {
      // login_Page.loginAsAnAdmin();
      login_Page.loginAsAMockedAdmin();

      // captures_Page.mock_TreesFilter().as('treesFilter');

      home_Page.captures_Button().click();

      // cy.wait('@treesFilter', { timeout: 15000 }).should((xhr) => {
      //   expect(xhr.responseBody[0]).to.have.property('id', 666666);
      //   expect(xhr).to.have.property('status', 200);
      // });
    });
    it('displays one of the status options "Approved, Awaiting Verification, Rejected" in the Verification Status column when "Select All" option in the "Verification Status" dropdownmenu is checked', () => {
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
    it('displays one of the status options "Approved" or "Awaiting Verification" in the Verification Status column when "Approved" and "Awaiting Verification" options in the "Verification Status" dropdownmenu are checked', () => {
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
    it('displays one of the status options "Awaiting Verification" or "Rejected" in the Verification Status column when "Awaiting Verification" and "Rejected" options in the "Verification Status" dropdownmenu are checked', () => {
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
    it('displays one of the status options "Approved" or "Rejected" in the Verification Status column when "Approved" and "Rejected" options in the "Verification Status" dropdownmenu are checked', () => {
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
    it('displays only "Approved" as the status option in the Verification Status column when only "Approved" option in the "Verification Status" dropdownmenu is checked', () => {
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
    it('displays only "Awaiting Verification" as the status option in the Verification Status column when only "Awaiting Verification" option in the "Verification Status" dropdownmenu is checked', () => {
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
    it('displays only "Rejected" as the status option in the Verification Status column when only "Rejected" option in the "Verification Status" dropdownmenu is checked', () => {
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
  }),
    describe('Tag text field', () => {
      beforeEach(() => {
        login_Page.loginAsAMockedAdmin();
        home_Page.captures_Button().click();
      });
      it('displays only captures that contains "seedling" as one of their tags when "seedling" is entered into the "Tag" text field', () => {
        captures_Page
          .when()
          .enterInto_Tag_TextField('seedling')
          .then()
          .captureTags_Column_ShouldContain('seedling');
      });
    }),
    describe('Organization dropdown menu', () => {
      it('displays all organizations in the Organization dropdown menu when a user logs in without an organization id, such as Admin', () => {
        login_Page.loginAsAMockedAdmin();
        home_Page.captures_Button().click();
        captures_Page
          .when()
          .open_Organization_DropdownMenu()
          .then()
          .organization_DropdownMenu_isNotEmpty();
      });
      it('displays only organizations that begin with FCC in the Organization dropdown menu when a user logs in with an organization id 11, such as Freetown Manager', () => {
        login_Page.loginAsAMockedFreetownManager();
        home_Page.captures_Button().click();
        captures_Page
          .when()
          .open_Organization_DropdownMenu()
          .then()
          .organization_DropdownMenu_containsOnly_OrgsBeginsWith('FCC');
      });
    });
});
