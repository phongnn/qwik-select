describe("Home page", () => {
  it("passes", () => {
    cy.visit("/");
    cy.findByText("Count: 100");
    cy.findByRole("button", { name: "Increment" }).click();
    cy.findByText("Count: 101");
  });
});
