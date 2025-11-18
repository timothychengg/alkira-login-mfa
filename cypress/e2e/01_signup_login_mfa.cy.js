describe('Signup → Login → MFA', () => {
  const email = `test${Date.now()}@example.com`
  const password = 'Password1'

  it('signs up a readWrite user, logs in, verifies MFA, reaches protected page', () => {
    cy.visit('/signup')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.contains('label', 'readWrite').click()
    cy.contains('button', 'Create account').click()

    cy.url().should('include', '/login')
    cy.get('input[name="email"]').should('have.value', email)
    cy.get('input[name="password"]').type(password)
    cy.contains('button', 'Sign in').click()

    cy.url().should('include', '/mfa')
    cy.get('input[name="otp"]').type('123456')
    cy.contains('button', 'Verify').click()

    cy.url().should('include', '/app')
    cy.contains('role: readWrite').should('exist')
  })
})
