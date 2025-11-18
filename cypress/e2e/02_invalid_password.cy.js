describe('Invalid password shows errors', () => {
  const email = `badpw${Date.now()}@example.com`
  const password = 'Password1'

  it('blocks login with wrong password', () => {
    // Create user via UI
    cy.visit('/signup')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.contains('button', 'Create account').click()

    cy.url().should('include', '/login')
    cy.get('input[name="email"]').clear().type(email)
    cy.get('input[name="password"]').type('Wrongpass1')
    cy.contains('button', 'Sign in').click()

    cy.contains('Invalid credentials').should('exist')
  })
})
