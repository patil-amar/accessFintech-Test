describe('Country page tests', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.visit('/')
        cy.navigateTo('countries')
        cy.clearSearch()
    })

    describe('Filter by country name', () => {
        it('I can search for country using full name ', () => {
            cy.searchByCountryName('India')
            cy.countryListShoudIncludeName('India')
        })

        it('I can search for partial name', () => {
            cy.searchByCountryName('United')
            cy.countryListShoudIncludeName('United')
        })

        it('List should be empty for invalid search', () => {
            cy.searchByCountryName('Invalid Country Name')
            cy.findAllByTestId('country-row').should('not.exist')
        })
    })

    describe('Country Actions', () => {

        it('I should see country list', () => {
            cy.findAllByTestId('country-row').should('exist')
                .its('length')
                .should('eql', 250)
        })

        it('I can mark country as visited/not visited list', () => {
            cy.searchByCountryName('India')
            cy.findAllByTestId('country-row').should('exist').its('length').should('eql', 1)
            cy.findAllByTestId('select-country-row-checkbox').first().click().should('be.checked')

            // Visited
            cy.selectCountryAction('Visited')
            cy.assertLocalStorage('visited', 'India')
            cy.assertLocalStorage('wanted', 'India', { exists: false })
            // Not visited
            cy.selectCountryAction('Not visited')
            cy.assertLocalStorage('visited', 'India', { exists: false })
            cy.assertLocalStorage('wanted', 'India', { exists: false })


        })

        it('I add mark country to my want to/ do not want to go list', () => {
            cy.searchByCountryName('India')
            cy.findAllByTestId('country-row').should('exist').its('length').should('eql', 1)
            cy.findAllByTestId('select-country-row-checkbox').first().click().should('be.checked')
            // Want to go 
            cy.selectCountryAction('Want to go')
            cy.assertLocalStorage('wanted', 'India')
            cy.assertLocalStorage('visited', 'India', { exists: false })

            // Do not want to go
            cy.selectCountryAction('Do not want to go')
            cy.assertLocalStorage('visited', 'India', { exists: false })
            cy.assertLocalStorage('wanted', 'India', { exists: false })
        })
    })
})

describe('When no country data api is not available', () => {
    beforeEach(() => {
        cy.intercept('POST', 'https://countries.trevorblades.com/', {
            statusCode: 401,
            body: {
                "message": "Not Authorised"
            }
        })
        cy.visit('/')
        cy.navigateTo('countries')
    })

    it('I should see no countries rows but show the hedding', () => {
        cy.findAllByTestId('country-row').should('not.exist')
        cy.get('thead').findByText('Flag').should('be.visible')
        cy.get('thead').findByText('Code').should('be.visible')
        cy.get('thead').findByText('Name').should('be.visible')
        cy.get('thead').findByText('Continent').should('be.visible')
        cy.get('thead').findByText('Capital').should('be.visible')
        cy.get('thead').findByText('Currency').should('be.visible')
        cy.get('thead').findByText('Language').should('be.visible')
        cy.get('thead').findByText('Visited').should('be.visible')
        cy.get('thead').findByText('Want to go').should('be.visible')
    })

})