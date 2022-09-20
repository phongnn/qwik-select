it("shows selected value in text input", () => {
  cy.visit("/selected");
  cy.wait(500);
  cy.get("input").should("have.value", "Nine");
});

it("highlights selected option in menu", () => {
  cy.visit("/selected");
  cy.wait(500);
  cy.get("input").click();
  cy.findByText("Nine").should("have.class", "selected");
});

it("allows navigation with keyboard", () => {
  cy.visit("/selected");
  cy.wait(500);
  const input = cy.get("input");

  // hovers selected option by default
  input.click();
  cy.findByText("Nine").should("have.class", "hover");

  // navigates with arrowUp and arrowDown
  cy.get("input").type("{upArrow}");
  cy.findByText("Eight").should("have.class", "hover");
  cy.get("input").type("{downArrow}{downArrow}{downArrow}");
  cy.findByText("One").should("have.class", "hover");

  // updates value on Enter
  input.type("{enter}");
  input.should("have.value", "One");
  cy.findByText("You've selected One.");
});

// clear wipes value and updates view
// when isFocused true container adds focused class
// when isFocused changes to true input should focus
