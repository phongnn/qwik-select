it("opens menu when click on text input", () => {
  cy.visit("/basics");
  cy.wait(500);
  cy.get("input").click();

  // opens menu
  cy.findAllByText(/(One)|(Two)|(Three)/).should("have.length", 3);

  // shows first item in hover state
  cy.findByText("One").should("have.class", "hover");
});

it("allows navigation with keyboard", () => {
  cy.visit("/basics");
  const input = cy.get("input");

  // opens menu
  input.type("{downArrow}");
  cy.wait(500);

  // shows first item in hover state
  cy.findByText("One").should("have.class", "hover");

  // updates hovered item on arrowDown and arrowUp
  input.type("{downArrow}{downArrow}");
  cy.findByText("Three").should("have.class", "hover");
  input.type("{upArrow}{upArrow}{upArrow}");
  cy.findByText("Five").should("have.class", "hover");

  // sets value on Enter
  input.type("{enter}");
  cy.findByText("You've selected Five.");
});

it("closes menu on Escape", () => {
  cy.visit("/basics");
  const input = cy.get("input");

  // opens menu
  input.type("{downArrow}");
  cy.wait(500);
  cy.findByText("One").should("have.class", "hover");

  // closes menu on Escape
  input.type("{esc}");
  cy.get(".item").should("not.exist");
});

it("closes menu when click outside", () => {
  cy.visit("/basics");
  cy.wait(500);

  // opens menu
  cy.get("input").click();
  cy.findByText("One").should("have.class", "hover");

  // closes menu when click outside
  cy.findByTestId("outside").click();
  cy.get(".item").should("not.exist");
});

it("sets value when click on item", () => {
  cy.visit("/basics");
  cy.wait(500);

  // opens menu
  const input = cy.get("input");
  input.click();

  // workaround: click on an item to get the event handler loaded first
  cy.findByText("Four").click();

  // opens menu again and clicks on an item
  input.click();
  cy.findByText("Three").click();
  cy.findByText("You've selected Three.");
});
