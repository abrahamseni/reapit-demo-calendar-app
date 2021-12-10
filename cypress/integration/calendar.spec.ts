/// <reference types="cypress" />

describe("Calendar page", () => {
  beforeEach(() => {
    cy.visit("/calendar");
  });

  it("should show calendar title", () => {
    cy.get("h1").contains("Calendar");
  });
});
