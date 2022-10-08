it("shows the placeholder", () => {
  cy.visit("/multi");
  cy.wait(500);
  cy.findByPlaceholderText("Select...");
});

it("allows user to select multiple values", () => {
  cy.visit("/multi");
  cy.wait(500);

  cy.get("input").click();
  cy.findByText("Three").click();
  cy.wait(500);

  cy.get("input").click();
  cy.findByText("Five").click();

  // menu should be closed
  cy.get(".qs-item").should("not.exist");

  // selected values: Three and Five
  cy.findAllByText(/(Three)|(Five)/).should("have.length", 2);
});

describe("shouldFilterSelectedOption", () => {
  it("filters selected options", () => {
    cy.visit("/multi");
    cy.wait(500);

    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 5);
    cy.findByText("Three").click();

    cy.wait(500);
    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 4); // no longer shows "Three"
  });

  it("works with async options", () => {
    cy.visit("/multi-async");
    cy.wait(500);

    // select "Three"
    cy.get("input").type("t");
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 2); // "Two", "Three"
    cy.findByText("Three").click();
    cy.wait(500);

    // expect "Three" no longer appears in the menu
    cy.get("input").type("t");
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 1); // "Two"
  });

  it("doesn't filter when shouldFilterSelectedOptions is false", () => {
    cy.visit("/multi-no-filter");
    cy.wait(500);

    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 5);
    cy.findByText("Three").click();

    cy.wait(500);
    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 5);
  });
});
