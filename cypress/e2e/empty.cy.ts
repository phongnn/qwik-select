it("shows a text input and a 'no options' message", () => {
  cy.visit("/empty");
  cy.findByPlaceholderText("Select...");
  cy.findByText("No options").should("have.class", "empty");
});

it("shows custom message", () => {
  cy.visit("/empty");
  cy.findByPlaceholderText("-- Select an option --");
  cy.findByText("No options available!!!");
});
