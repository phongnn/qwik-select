it("fetches and shows options", () => {
  cy.visit("/async");

  // click to get filterOptions$ loaded first
  cy.get("input").click();
  cy.wait(500);

  // shows loading indicator
  cy.get("input").type("t");
  cy.wait(1000);
  cy.get(".qs-spinner");

  // shows filtered options
  cy.wait(2000);
  cy.get(".qs-item").should("have.length", 2); // "Two", "Three"
  cy.get(".qs-spinner").should("not.exist");

  // hovers the first item by default
  cy.findByText("Two").should("have.attr", "data-hovered", "true");
});

it("hides clear button while loading", () => {
  cy.visit("/async");
  cy.wait(500);

  // select an option, expect to see clear button
  cy.get("input").click();
  cy.wait(2000);
  cy.findByText("Two").click();
  cy.wait(500);
  cy.get(".qs-clear-button");

  // reopen the menu, expect to see the loading indicator, not the clear button
  cy.get("input").click();
  cy.get(".qs-clear-button").should("not.exist");
  cy.get(".qs-spinner");
});

it("debounces fetch requests", () => {
  cy.visit("/async");
  cy.get("input").type("t").wait(200);
  cy.get("input").type("h").wait(200);
  cy.get("input").type("r").wait(200);
  cy.get("input").type("e").wait(200);
  cy.get("input").type("e");
  cy.wait(1000);
  cy.get(".qs-item").should("have.length", 1); // "Three"

  cy.window().then((win) => {
    // @ts-ignore
    console.log(win.__qwik_select__async_calls__);
    // @ts-ignore
    assert.equal(win.__qwik_select__async_calls__.length, 1);
    // @ts-ignore
    assert.equal(win.__qwik_select__async_calls__[0], "three");
  });
});

it("ignores fetched data when menu already closed", () => {
  cy.visit("/async");

  // enter some text but immediately close the menu
  cy.get("input").type("t");
  cy.wait(500);
  cy.get("input").click();

  // reopen the menu when data fetching is done
  cy.wait(2000);
  cy.get("input").click();
  cy.get(".qs-item").should("not.exist");
});

it("shows correct list when click then type", () => {
  // NOTE: it's a race condition:
  // click -> openMenu() -> filterOptions() returns all options
  // type -> filterOptions() returns a subset of options
  // expect: menu shows a subset of options
  cy.visit("/async");
  cy.wait(500);
  cy.get("input").click().type("t");

  cy.wait(2000);
  cy.get(".qs-item").should("have.length", 2); // "Two", "Three"
});

it("can handle race condition", () => {
  cy.visit("/race-condition");
  cy.wait(500);

  // type random text to get the event handler loaded
  cy.get("input").type("abc");
  cy.wait(500);
  cy.get("input").type("{esc}"); // close the menu
  cy.wait(500);

  // type "t" followed by "h" after 500ms
  cy.get("input").type("t"); // "Two", "Three"
  cy.wait(500);
  cy.get("input").type("h"); // "Three"

  // wait for both requests to complete
  cy.wait(1000);

  // it should display the result of the 2nd request
  cy.get(".qs-item").should("have.length", 1); // "Three"
});
