it("fetches and shows options", () => {
  cy.visit("/async");
  // cy.wait(500);
  cy.get("input").type("t");

  // shows loading indicator
  cy.wait(1000);
  cy.get(".spinner");

  // shows filtered options
  cy.wait(1000);
  cy.get(".item").should("have.length", 2); // "Two", "Three"

  // hovers the first item by default
  cy.findByText("Two").should("have.class", "hover");
});
