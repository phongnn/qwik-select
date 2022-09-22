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
  const input = cy.get("input");

  input.type("p");
  cy.get(".item").should("have.length", 3); // "Apple", "Pear", "Pineapple"
  input.type("e");
  cy.get(".item").should("have.length", 1); // "Pear"

  // shows "No options"
  input.type("p");
  cy.get(".item").should("have.length", 0);
  cy.findByText("No options");

  // delete last character -> "pe"
  input.type("{backspace}");
  cy.get(".item").should("have.length", 1); // "Pear"
});

it("allows navigation with keyboard", () => {
  cy.visit("/filterable");
  cy.wait(500);
  const input = cy.get("input");

  input.type("p"); // "Apple", "Pear", "Pineapple"
  cy.findByText("Apple").should("have.class", "hover");

  // updates hovered item on arrowDown and arrowUp
  input.type("{upArrow}");
  cy.findByText("Pineapple").should("have.class", "hover");

  input.type("{downArrow}{downArrow}");
  cy.findByText("Pear").should("have.class", "hover");
});
