/// <reference types="cypress" />

describe("Calendar page", () => {
  beforeEach(() => {
    cy.visit("/calendar");
  });

  it("should show calendar title", () => {
    cy.get("#signInFormUsername").type(`abraham@softwareseni.com`, {
      force: true,
    });
    cy.get("#signInFormPassword").type(`Abraham@softwareseni221121{enter}`, {
      force: true,
    });
    // cy.get("h1").contains("Calendar");
  });
});
