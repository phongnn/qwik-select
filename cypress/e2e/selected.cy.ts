it("shows selected value", () => {
  cy.visit("/selected");
  cy.wait(500);
  cy.findByText("Nine").should("have.class", "selected-item-label");
});

it("highlights selected option in menu", () => {
  cy.visit("/selected");
  cy.wait(500);
  cy.get("input").click();
  cy.get(".item.selected").should("have.text", "Nine");
});

it("allows navigation with keyboard", () => {
  cy.visit("/selected");
  cy.wait(500);
  const input = cy.get("input");

  // hovers selected option by default
  input.click();
  cy.get(".item.hover").should("have.text", "Nine");

  // navigates with arrowUp and arrowDown
  cy.get("input").type("{upArrow}");
  cy.findByText("Eight").should("have.class", "hover");
  cy.get("input").type("{downArrow}{downArrow}{downArrow}");
  cy.findByText("One").should("have.class", "hover");

  // updates value on Enter
  input.type("{enter}");
  cy.findByText("You've selected One.");
});
