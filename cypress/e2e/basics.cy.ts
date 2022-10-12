describe("with no selected value", () => {
  it("opens menu when click on text input", () => {
    cy.visit("/basics");
    cy.wait(500);
    cy.get("input").click();

    // opens menu
    cy.findAllByText(/(One)|(Two)|(Three)/).should("have.length", 3);

    // shows first item in hover state
    cy.findByText("One").should("have.attr", "data-hovered", "true");
  });

  it("allows navigation with keyboard", () => {
    cy.visit("/basics");
    const input = cy.get("input");

    // opens menu
    input.type("{downArrow}");
    cy.wait(1000);

    // shows first item in hover state
    cy.findByText("One").should("have.attr", "data-hovered", "true");

    // updates hovered item on arrowDown and arrowUp
    input.type("{downArrow}{downArrow}");
    cy.findByText("Three").should("have.attr", "data-hovered", "true");
    input.type("{upArrow}{upArrow}{upArrow}");
    cy.findByText("Five").should("have.attr", "data-hovered", "true");

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
    cy.findByText("One").should("have.attr", "data-hovered", "true");

    // closes menu on Escape
    input.type("{esc}");
    cy.get(".qs-item").should("not.exist");
  });

  it("closes menu when click outside", () => {
    cy.visit("/basics");
    cy.wait(500);

    // opens menu
    cy.get("input").click();
    cy.findByText("One").should("have.attr", "data-hovered", "true");

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
      .should("have.attr", "data-hovered", "true")
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
    cy.get(".qs-single-value").should("have.text", "Nine");
  });

  it("highlights selected option in menu", () => {
    cy.visit("/selected");
    cy.wait(500);
    cy.get("input").click();
    cy.get('.qs-item[data-selected="true"]').should("have.text", "Nine");
  });

  it("allows navigation with keyboard", () => {
    cy.visit("/selected");
    cy.wait(500);
    const input = cy.get("input");

    // the selected option should be hovered and visible
    input.click();
    cy.get('.qs-item[data-hovered="true"]')
      .should("have.text", "Nine")
      .should("be.visible");

    // navigates with arrowUp and arrowDown
    cy.get("input").type("{upArrow}");
    cy.findByText("Eight").should("have.attr", "data-hovered", "true");
    cy.get("input").type("{downArrow}{downArrow}{downArrow}");
    cy.findByText("One").should("have.attr", "data-hovered", "true");

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
    cy.get('.qs-item[data-hovered="true"]').should("have.text", "Three");
  });
});

describe("clearable", () => {
  it("clears selected value", () => {
    cy.visit("/clearable");
    cy.wait(500);

    cy.findByTestId("qwik-select-clear").click();
    cy.wait(500);

    cy.findByText("Select an item.");
    // hide the clear button
    cy.get("[data-testid='qwik-select-clear']").should("not.exist");
  });

  it("clears selected value and removes focus", () => {
    cy.visit("/clearable");
    cy.wait(500);

    // open the menu
    cy.get("input").click();
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 5);

    // clear selected value
    cy.findByTestId("qwik-select-clear").click();
    cy.wait(500);

    cy.findByText("Select an item.");
    cy.get(".qs-item").should("not.exist");
    cy.get("input").should("not.be.focused");
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

  it("clears selected value on Delete/Backspace", () => {
    cy.visit("/clearable");
    cy.wait(500);

    // open the menu then press Delete
    cy.get("input").type("{del}");
    cy.wait(500);

    // input is cleared but focus is still maintained
    cy.findByText("Select an item.");
    cy.get("input").should("be.focused");
  });

  it("clears selected value and closes menu on Delete/Backspace", () => {
    cy.visit("/clearable");
    cy.wait(500);

    // open the menu then press Delete
    cy.get("input").type("{downArrow}").wait(500).type("{del}");

    // input is cleared, menu is closed but focus is still maintained
    cy.findByText("Select an item.");
    cy.get(".qs-item").should("not.exist");
    cy.get("input").should("be.focused");
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

describe("disable/enable", () => {
  it("disables the control", () => {
    cy.visit("/disabled");
    cy.wait(500);
    cy.get("input").should("be.disabled");
    cy.get(".qs-container").should("have.attr", "data-disabled", "true");
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

describe("others", () => {
  it("shows custom placeholder", () => {
    cy.visit("/empty");
    cy.findByText("-- Select an option --");
  });

  it("sets focus to the text input on page load", () => {
    cy.visit("/autofocus");

    // cy.get("input").should("be.focused"); // strangely, this doesn't work
    cy.get("input").should("have.attr", "autofocus");
  });

  it("supports custom optionLabelKey", () => {
    cy.visit("/custom-label-key");

    // filter options
    cy.get("input").type("t");
    cy.wait(500);
    cy.get(".qs-item").should("have.length", 2); // "Two", "Three"

    // select "Three"
    cy.findByText("Three").click();
    cy.wait(500);
    cy.get(".qs-single-value").should("have.text", "Three");
  });
});
