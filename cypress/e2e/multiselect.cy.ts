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

  // selected values: Four, Three and Five
  cy.findAllByText(/(Four)|(Three)|(Five)/).should("have.length", 3);
});

describe("filtering selected options", () => {
  it("filters initial selected options", () => {
    cy.visit("/multi");
    cy.wait(500);

    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 4); // "One" to "Five" without "Four"
  });

  it("filters selected options", () => {
    cy.visit("/multi");
    cy.wait(500);

    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 4); // "One" to "Five" without "Four"
    cy.findByText("Three").click();

    cy.wait(500);
    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 3); // no longer shows "Three"
  });

  it("filters selected options when select with keyboard", () => {
    cy.visit("/multi");
    cy.wait(500);

    // open menu
    cy.get("input").type("{downArrow}");
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 4); // "One" to "Five" without "Four"

    // select "Two"
    cy.get("input").type("{downArrow}{enter}");
    cy.wait(500);

    cy.get("input").click();
    cy.get(".qs-item").should("have.length", 3); // no longer shows "Two"
  });

  it("works with async options", () => {
    cy.visit("/multi-async");
    cy.wait(500);

    // selected value is "Three" => expect it not to appear in the menu
    cy.get("input").type("t");
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 1); // "Two" only

    // select "Two"
    cy.findByText("Two").click();
    cy.wait(500);

    // expect "Two" no longer appears in the menu
    cy.get("input").type("t");
    cy.wait(500);
    cy.get(".qs-item").should("not.exist");
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

it("removes a selected value when click on button", () => {
  cy.visit("/multi");
  cy.wait(500);

  cy.get(".qs-multi-value-clear").click();
  cy.wait(500);
  cy.findByPlaceholderText("Select...");
});

it("clears selected values", () => {
  cy.visit("/multi");
  cy.wait(500);

  // clear selected values
  cy.findByTestId("qwik-select-clear").click();
  cy.wait(500);
  cy.findByPlaceholderText("Select...");

  // hide the clear button
  cy.get("[data-testid='qwik-select-clear']").should("not.exist");
});
