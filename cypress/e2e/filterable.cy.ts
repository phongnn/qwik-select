/*
  { value: 1, label: "Apple" },
  { value: 2, label: "Banana" },
  { value: 3, label: "Pear" },
  { value: 4, label: "Pineapple" },
  { value: 5, label: "Kiwi" },
*/

it("filters options as user types", () => {
  cy.visit("/filterable");
  cy.wait(500);
  cy.get("input").type("p");
  cy.get(".item").should("have.length", 3); // "Apple", "Pear", "Pineapple"
  cy.get("input").type("e");
  cy.get(".item").should("have.length", 1); // "Pear"

  // shows "No options"
  cy.get("input").type("p");
  cy.get(".item").should("have.length", 0);
  cy.findByText("No options");

  // delete last character -> "pe"
  cy.get("input").type("{backspace}");
  cy.get(".item").should("have.length", 1); // "Pear"
});
