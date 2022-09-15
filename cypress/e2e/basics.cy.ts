it("opens list when click on text input", () => {
  cy.visit("/basics");
  cy.findByPlaceholderText("Select...").click();
  cy.findAllByText(/(One)|(Two)|(Three)|(Four)|(Five)/).should(
    "have.length",
    5
  );
  // cy.findByText("Two").click();
  // cy.findByDisplayValue("Two")
  // cy.findByText("You've selected two.")
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
