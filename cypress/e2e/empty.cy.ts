it("shows a text input and a 'no options' message", () => {
  cy.visit("/empty");
  cy.wait(500);

  // "force: true" because the div is actually underneath the text input
  cy.findByText("Select...").click({ force: true });
  cy.findByText("No options").should("have.class", "empty");
});

it("shows custom message", () => {
  cy.visit("/empty");
  cy.wait(500);
  cy.findByText("-- Select an option --").click({ force: true });
  cy.findByText("No options available!!!");
});
