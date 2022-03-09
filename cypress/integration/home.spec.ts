describe('Home page tests', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.homepageIsDisplayed()
        cy.clearLocalStorage()
    })

    describe('Adding and removing countries', () => {
        it('I can add or remove visited countries', () => {
            cy.navigateTo('countries')
            cy.markCountryVisited('India')
            cy.assertLocalStorage('visited', 'India')
            cy.navigateTo('home')
            cy.countryVisitedCountShouldBe(1)

            cy.navigateTo('countries')
            cy.unmarkCountryVisited('India')
            cy.assertLocalStorage('visited', 'India', { exists: false })
            cy.navigateTo('home')
            cy.countryVisitedCountShouldBe(0)
        })



        it('I can add/remove countries I want to visit', () => {
            cy.navigateTo('countries')
            cy.markCountryWantToGo('India')
            cy.assertLocalStorage('wanted', 'India')
            cy.navigateTo('home')
            cy.wantToGoCountShouldBe(1)

            cy.navigateTo('countries')
            cy.unmarkCountryWantToGo('India')
            cy.assertLocalStorage('wanted', 'India', { exists: false })
            cy.navigateTo('home')
            cy.wantToGoCountShouldBe(0)
        })

    })

    describe('Resetting counttries', () => {

        it('Country visited reset button should set count to zero', () => {
            cy.navigateTo('countries')
            cy.markCountryVisited('India')
            cy.assertLocalStorage('visited', 'India')
            cy.markCountryVisited('United Kingdom')
            cy.assertLocalStorage('visited', 'United Kingdom')
            cy.navigateTo('home')
            cy.countryVisitedCountShouldBe(2)
            cy.findByTestId('countries-visited').findByRole('button', { name: 'Reset' }).click()
            cy.assertLocalStorage('visited', 'India', { exists: false })
            cy.assertLocalStorage('visited', 'United Kingdom', { exists: false })
            cy.countryVisitedCountShouldBe(0)
        })

        it('Countries I want to visit reset button should set count to zero', () => {
            cy.navigateTo('countries')
            cy.markCountryWantToGo('India')
            cy.assertLocalStorage('wanted', 'India')
            cy.markCountryWantToGo('United Kingdom')
            cy.assertLocalStorage('wanted', 'United Kingdom')
            cy.navigateTo('home')
            cy.wantToGoCountShouldBe(2)
            cy.findByTestId('countries-wanted').findByRole('button', { name: 'Reset' }).click()
            cy.assertLocalStorage('wanted', 'India', { exists: false })
            cy.assertLocalStorage('wanted', 'United Kingdom', { exists: false })
            cy.wantToGoCountShouldBe(0)
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
    })

    it('I should see zero country count', () => {
        cy.findByTestId('countries-available-count').should('have.text', 0)
        cy.findByTestId('countries-visited-count').should('have.text', 0)
        cy.findByTestId('countries-wanted-count').should('have.text', 0)
    })
})



