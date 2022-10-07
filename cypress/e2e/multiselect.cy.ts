it("shows the placeholder", () => {
  cy.visit("/multi");
  cy.wait(500);
  cy.findByText("Select...");
});

it("allows user to select multiple values", () => {
  cy.visit("/multi");
  cy.wait(500);

  cy.get("input").click();
  cy.findByText("Three").click();

  cy.get("input").click();
  cy.findByText("Five").click();

  // menu should be closed
  cy.get(".qs-item").should("not.exist");

  // selected values: Three and Five
  cy.findAllByText(/(Three)|(Five)/).should("have.length", 2);
});
