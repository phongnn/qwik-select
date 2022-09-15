it("opens list when click on text input", () => {
  cy.visit("/basics");
  cy.wait(500);
  cy.findByPlaceholderText("Select...").click();
  cy.findAllByText(/(One)|(Two)|(Three)/).should("have.length", 3);
});

it("shows first item in hover state", () => {
  cy.visit("/basics");
  cy.wait(500);
  cy.findByPlaceholderText("Select...").click();
  cy.findByText("One").should("have.class", "hover");
});

// List starts with first item in hover state
// hover item updates on keyUp or keyDown
// on enter active item fires a itemSelected event
// on tab active item fires a itemSelected event
// selected item\'s default view
// should highlight active list item
// list scrolls to active item
// list scrolls to hovered item when navigating with keys
// select view updates with value updates
// clear wipes value and updates view
// when isFocused true container adds focused class
// when isFocused changes to true input should focus
