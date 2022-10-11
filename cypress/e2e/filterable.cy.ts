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
  cy.get(".qs-item").should("have.length", 3); // "Apple", "Pear", "Pineapple"
  input.type("e");
  cy.get(".qs-item").should("have.length", 1); // "Pear"

  // shows "No options"
  input.type("p");
  cy.get(".qs-item").should("have.length", 0);
  cy.findByText("No options");

  // delete last character -> "pe"
  input.type("{backspace}");
  cy.get(".qs-item").should("have.length", 1); // "Pear"
});

it("allows navigation with keyboard", () => {
  cy.visit("/filterable");
  cy.wait(500);
  const input = cy.get("input");

  input.type("p"); // "Apple", "Pear", "Pineapple"
  cy.findByText("Apple").should("have.attr", "data-hovered", "true");

  // updates hovered item on arrowDown and arrowUp
  input.type("{upArrow}");
  cy.findByText("Pineapple").should("have.attr", "data-hovered", "true");

  input.type("{downArrow}{downArrow}");
  cy.findByText("Pear").should("have.attr", "data-hovered", "true");
});

it("resets text input when closing menu", () => {
  cy.visit("/filterable");
  cy.wait(500);

  // on Escape
  cy.get("input").type("b").wait(500).type("{esc}"); // banana
  cy.get("input").should("have.value", "");

  // click on the text input to close menu
  cy.get("input").type("b").click(); // banana
  cy.get("input").should("have.value", "");
});

it("resets text input after selecting a value", () => {
  // NOTE: the selected value is actually displayed
  // in a div underneath the input
  cy.visit("/filterable");
  cy.wait(500);
  cy.get("input").type("pe"); // "Pear";
  cy.wait(500);
  cy.get("input").type("{enter}");

  cy.findByText("You've selected Pear.");
  cy.get("input").should("have.value", "");
});

it("clears filter when closing menu", () => {
  cy.visit("/filterable");
  cy.wait(500);

  // select a value
  cy.get("input").type("pe");
  cy.wait(500);
  cy.get("input").type("{enter}");

  // reopen the menu and check if all items are available
  cy.get("input").click();
  cy.get(".qs-item").should("have.length", 5);
});
