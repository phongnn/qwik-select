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
  cy.findByText("Two").should("have.class", "qs-hovered");
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
