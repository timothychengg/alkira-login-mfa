describe('Role-based access control', () => {
  const email = `readonly${Date.now()}@example.com`
  const password = 'Password1'

  it('readOnly user cannot add notes', () => {
    cy.visit('/signup')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.contains('label', 'readOnly').click()
    cy.contains('button', 'Create account').click()

    cy.url().should('include', '/login')
    cy.get('input[name="email"]').clear().type(email)
    cy.get('input[name="password"]').type(password)
    cy.contains('button', 'Sign in').click()

    cy.url().should('include', '/mfa')
    cy.get('input[name="otp"]').type('123456')
    cy.contains('button', 'Verify').click()

    cy.url().should('include', '/app')
    cy.contains('readOnly').should('exist')
    cy.get('input[placeholder*="Read‑only users"]').should('be.disabled')
    cy.contains('button', 'Add').should('be.disabled')
  })
})
