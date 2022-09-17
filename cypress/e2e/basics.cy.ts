it("opens list and allows navigation with keyboard", () => {
  cy.visit("/basics");
  cy.wait(500);
  const input = cy.findByPlaceholderText("Select...");

  // opens list when click on text input
  input.click();
  cy.findAllByText(/(One)|(Two)|(Three)/).should("have.length", 3);

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

// selected item\'s default view
// should highlight active list item
// list scrolls to active item
// list scrolls to hovered item when navigating with keys
// select view updates with value updates
// clear wipes value and updates view
// when isFocused true container adds focused class
// when isFocused changes to true input should focus
