it("shows a text input and a 'no options' message", () => {
  cy.visit("/empty");
  cy.wait(500);
  cy.findByPlaceholderText("Select...").click();
  cy.findByText("No options").should("have.class", "empty");
});

it("shows custom message", () => {
  cy.visit("/empty");
  cy.wait(500);
  cy.findByPlaceholderText("-- Select an option --").click();
  cy.findByText("No options available!!!");
});
