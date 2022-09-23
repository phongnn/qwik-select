describe("empty list of options", () => {
  it("shows a text input and a 'no options' message", () => {
    cy.visit("/empty");
    cy.wait(500);

    // "force: true" because the div is actually underneath the text input
    cy.findByText("Select...").click({ force: true });
    cy.findByText("No options").should("have.class", "empty");
  });

  it("shows custom message", () => {
    cy.visit("/empty");
    cy.wait(500);
    cy.findByText("-- Select an option --").click({ force: true });
    cy.findByText("No options available!!!");
  });
});

describe("with no selected value", () => {
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
    cy.wait(1000);

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
});

describe("with selected value", () => {
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
});

describe("disable/enable", () => {
  it("disables the control", () => {
    cy.visit("/disabled");
    cy.wait(500);
    cy.get("input").should("be.disabled");
    cy.get(".container").should("have.class", "disabled");
  });

  it("enables the control", () => {
    cy.visit("/disabled");
    // cy.wait(500);
    cy.findByText("Enable Select").click();
    cy.wait(500);
    cy.get("input").type("t");
    cy.wait(500);
    cy.get(".item").should("have.length", 2); // "Two", "Three"
  });
});

describe("clearable", () => {
  it("clears selected value", () => {
    cy.visit("/clearable");
    cy.wait(500);
    cy.findByTestId("qwik-select-clear").click();

    // clear selected value
    cy.wait(500);
    cy.findByText("Select an item.");

    // hide the clear button
    cy.get("[data-testid='qwik-select-clear']").should("not.exist");
  });
});
