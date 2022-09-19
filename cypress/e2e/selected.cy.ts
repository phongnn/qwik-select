it("shows selected value", () => {
  cy.visit("/selected");
  cy.wait(500);
  cy.get("input").should("have.value", "Nine");
});

it.only("highlights selected option in menu", () => {
  cy.visit("/selected");
  cy.wait(500);
  cy.get("input").click();

  cy.findByText("Nine").should("have.class", "selected");
});

// should highlight active list item
// list scrolls to active item
// list scrolls to hovered item when navigating with keys
// select view updates with value updates
// clear wipes value and updates view
// when isFocused true container adds focused class
// when isFocused changes to true input should focus
