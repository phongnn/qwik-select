it("fetches and shows options", () => {
  cy.visit("/async");
  cy.wait(500);
  cy.get("input").type("t");

  // shows loading indicator
  cy.wait(1000);
  cy.get(".qs-spinner");

  // shows filtered options
  cy.wait(2000);
  cy.get(".qs-item").should("have.length", 2); // "Two", "Three"

  // hovers the first item by default
  cy.findByText("Two").should("have.attr", "data-hovered", "true");
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
