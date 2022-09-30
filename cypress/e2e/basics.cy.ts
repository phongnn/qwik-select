describe("empty list of options", () => {
  it("shows a text input and a 'no options' message", () => {
    cy.visit("/empty");
    cy.wait(500);

    // "force: true" because the div is actually underneath the text input
    cy.findByText("Select...").click({ force: true });
    cy.findByText("No options").should("have.class", "qs-empty");
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
    cy.findByText("One").should("have.class", "qs-hovered");
  });

  it("allows navigation with keyboard", () => {
    cy.visit("/basics");
    const input = cy.get("input");

    // opens menu
    input.type("{downArrow}");
    cy.wait(1000);

    // shows first item in hover state
    cy.findByText("One").should("have.class", "qs-hovered");

    // updates hovered item on arrowDown and arrowUp
    input.type("{downArrow}{downArrow}");
    cy.findByText("Three").should("have.class", "qs-hovered");
    input.type("{upArrow}{upArrow}{upArrow}");
    cy.findByText("Five").should("have.class", "qs-hovered");

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
    cy.findByText("One").should("have.class", "qs-hovered");

    // closes menu on Escape
    input.type("{esc}");
    cy.get(".qs-item").should("not.exist");
  });

  it("closes menu when click outside", () => {
    cy.visit("/basics");
    cy.wait(500);

    // opens menu
    cy.get("input").click();
    cy.findByText("One").should("have.class", "qs-hovered");

    // closes menu when click outside
    cy.findByTestId("outside").click();
    cy.get(".qs-item").should("not.exist");
  });

  it("sets value when click on item", () => {
    cy.visit("/basics");
    cy.wait(500);

    // opens menu
    const input = cy.get("input");
    input.click();

    // workaround: click on an item to get the event handler loaded first
    cy.findByText("Four").click();
    cy.wait(500);

    // opens menu again and clicks on an item
    input.click();
    cy.findByText("Three").click();
    cy.findByText("You've selected Three.");

    cy.get("input").should("not.be.focused");
  });
});

describe("automatic menu scrolling", () => {
  it("scrolls on arrow down/up", () => {
    cy.visit("/scroll");
    cy.wait(500);

    // open the menu, option "Seven" is currently not visible
    cy.get("input").type("{downArrow}");
    cy.wait(500);
    cy.get(".qs-item:nth-child(7)").should("not.be.visible");

    // navigate to option "Seven", it should become visible
    cy.get("input").type(
      "{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}"
    );
    cy.wait(500);
    cy.get(".qs-item:nth-child(7)")
      .should("have.class", "qs-hovered")
      .should("be.visible");
  });

  it("scrolls to selected option when menu opens", () => {
    cy.visit("/scroll");
    cy.wait(500);

    // select an option
    cy.get("input").click();
    cy.findByText("Seven").click();

    // reopen the menu, expect the selected option to be visible
    cy.wait(500);
    cy.get("input").click();
    cy.wait(500);
    cy.get(".qs-item:nth-child(7)").should("be.visible");
  });
});

describe("with selected value", () => {
  it("shows selected value", () => {
    cy.visit("/selected");
    cy.wait(500);
    cy.get(".qs-selected-item-label").should("have.text", "Nine");
  });

  it("highlights selected option in menu", () => {
    cy.visit("/selected");
    cy.wait(500);
    cy.get("input").click();
    cy.get(".qs-item.qs-selected").should("have.text", "Nine");
  });

  it("allows navigation with keyboard", () => {
    cy.visit("/selected");
    cy.wait(500);
    const input = cy.get("input");

    // the selected option should be hovered and visible
    input.click();
    cy.get(".qs-item.qs-hovered")
      .should("have.text", "Nine")
      .should("be.visible");

    // navigates with arrowUp and arrowDown
    cy.get("input").type("{upArrow}");
    cy.findByText("Eight").should("have.class", "qs-hovered");
    cy.get("input").type("{downArrow}{downArrow}{downArrow}");
    cy.findByText("One").should("have.class", "qs-hovered");

    // updates value on Enter
    input.type("{enter}");
    cy.findByText("You've selected One.");
  });

  it("hovers correct item after selected option changed", () => {
    cy.visit("/selected");
    cy.wait(500);

    // open menu and select an option
    cy.get("input").click();
    cy.findByText("Three").click();
    cy.wait(500);

    // reopen the menu, expect the newly selected option to be hovered
    cy.get("input").click();
    cy.get(".qs-item.qs-hovered").should("have.text", "Three");
  });
});

describe("disable/enable", () => {
  it("disables the control", () => {
    cy.visit("/disabled");
    cy.wait(500);
    cy.get("input").should("be.disabled");
    cy.get(".qs-container").should("have.class", "qs-disabled");
  });

  it("enables the control", () => {
    cy.visit("/disabled");
    // cy.wait(500);
    cy.findByText("Enable Select").click();
    cy.wait(500);
    cy.get("input").type("t");
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 2); // "Two", "Three"
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

  it("hides clear button when user starts typing", () => {
    cy.visit("/clearable");
    cy.wait(500);

    // clear button should initially appear
    cy.findByTestId("qwik-select-clear");

    // the button should disappears when user starts typing
    cy.get("input").type("abc");
    cy.wait(500);
    cy.get("[data-testid='qwik-select-clear']").should("not.exist");
  });
});

describe("events", () => {
  it("calls onInput$ event handler", () => {
    cy.visit("/events");

    cy.get("input").type("a");
    cy.wait(500);
    cy.findByTestId("log").should("have.text", "You've entered a");
    cy.get("input").type("b");
    cy.findByTestId("log").should("have.text", "You've entered ab");
    cy.get("input").type("{backspace}");
    cy.findByTestId("log").should("have.text", "You've entered a");
    cy.get("input").type("{esc}");
    cy.wait(500);
    cy.findByTestId("log").should("have.text", "");
  });

  it("calls onFocus$ and onBlur$ event handler", () => {
    cy.visit("/events");

    cy.findByTestId("log").should("have.text", "");

    // workaround: a couple of clicks to get event handlers loaded
    cy.get("input").click();
    cy.findByTestId("log").click();
    cy.wait(2000);

    // should call onFocus$
    cy.get("input").click();
    cy.findByTestId("log").should("have.text", "Focused.");

    // should call onBlur$
    cy.findByTestId("log").click();
    cy.findByTestId("log").should("have.text", "Blurred.");
  });
});

describe("others", () => {
  it("sets focus to the text input on page load", () => {
    cy.visit("/autofocus");

    // cy.get("input").should("be.focused"); // strangely, this doesn't work
    cy.get("input").should("have.attr", "autofocus");
  });
});
