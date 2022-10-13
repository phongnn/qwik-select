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
    // cy.findByText("Two").click();
    cy.get("input").type("{enter}");
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

describe("removing a selected option", () => {
  it("removes selected value when click on button", () => {
    cy.visit("/multi");
    cy.wait(500);

    cy.get(".qs-multi-value-clear").click();
    cy.wait(500);

    // expect the menu to show all options
    cy.findByPlaceholderText("Select...").type("{downArrow}");
    cy.get(".qs-item").should("have.length", 5);
  });

  it("removes selected value and closes menu when click on button", () => {
    cy.visit("/multi");
    cy.wait(500);

    // open the menu
    cy.get("input").click();
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 4); // "One" to "Five" without "Four"

    // remove the selected value
    cy.get(".qs-multi-value-clear").click();
    cy.wait(500);

    // expect the menu to be closed and focus is removed
    cy.get(".qs-item").should("not.exist");
    cy.findByPlaceholderText("Select...").should("not.be.focused");
  });

  it("removes selected value on Delete/Backspace", () => {
    cy.visit("/multi");
    cy.wait(500);

    // remove selected option ("Three") with Backspace
    cy.get("input").type("{backspace}");
    cy.wait(500);

    // select "One"
    const input = cy.findByPlaceholderText("Select...").type("o");
    cy.wait(500);
    input.type("{enter}");
    cy.wait(500);

    // remove selected option ("One") with Delete
    cy.get("input").type("{del}");
    cy.findByPlaceholderText("Select...");
  });

  it("removes selected value and closes menu on Delete/Backspace", () => {
    cy.visit("/multi");
    cy.wait(500);

    // open the menu then press Delete
    cy.get("input").type("{downArrow}").wait(500);
    cy.get(".qs-item").should("have.length", 4);
    cy.get("input").type("{del}");

    // input is cleared, menu is closed but focus is still maintained
    cy.findByPlaceholderText("Select...");
    cy.get(".qs-item").should("not.exist");
    cy.get("input").should("be.focused");
  });
});

it("clears selected values", () => {
  cy.visit("/multi");
  cy.wait(500);

  // clear selected values
  cy.get(".qs-clear-button").click();
  cy.wait(500);
  const input = cy.findByPlaceholderText("Select...");

  // hide the clear button
  cy.get(".qs-clear-button").should("not.exist");

  // expect the menu to show all options
  input.type("{downArrow}");
  cy.get(".qs-item").should("have.length", 5);
});
