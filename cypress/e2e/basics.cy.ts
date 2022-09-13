describe("Basic features", () => {
  it("renders the Select control", () => {
    cy.visit("/basics");
    cy.findByText("Select...");
  });
});
