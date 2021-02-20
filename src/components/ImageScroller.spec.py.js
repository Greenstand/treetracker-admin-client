/* eslint-disable */
import { mount } from 'cypress-react-unit-test'
import React from 'react'
import theme from './common/theme'
import { ThemeProvider } from '@material-ui/core/styles'

import ImageScroller from './ImageScroller'

describe('ImageScroller', () => {

  it('works', () => {
    const blankMessage = 'No images'
    mount(
      <ThemeProvider theme={theme}>
        <ImageScroller images={[]} selectedImage={null} onSelectImage={() => {}} blankMessage={blankMessage} />
      </ThemeProvider>
    )
    cy.contains(blankMessage)
    cy.get('.image-list').should('exist')
    cy.get('.image-card').should('not.exist')
    cy.get('#scroll-right').should('not.exist')
    cy.get('#scroll-right').should('not.exist')
    cy.get('#loading').should('not.exist')
  })

  it('should show loading indicator', () => {
    mount(
      <ThemeProvider theme={theme}>
        <ImageScroller
          images={[]}
          selectedImage={null}
          onSelectImage={() => {}}
          loading={true}
        />
      </ThemeProvider>
    )

    cy.get('#loading').should('exist')
  })
  
  describe('with images', () => {

    let images
    let selectedImage

    const selectImage = (img) => {
      selectedImage = img
    }

    beforeEach(() =>{
      images = [
        'https://greenstand.org/fileadmin/_processed_/d/4/csm_little_Jony_bdf756638d.jpg',
        'https://greenstand.org/fileadmin/_processed_/9/f/csm_2019.08.12.09.54.39_1ca43554-b139-4ae2-bbc9-c9a37c43e645_IMG_20190812_093641_-1471408775_0bb24d7c21.jpg',
        'https://greenstand.org/fileadmin/_processed_/e/3/csm_IMG_0017_3c859de144.jpg',
        'https://greenstand.org/fileadmin/_processed_/9/3/csm_PHOTO-2019-08-05-11-50-37_f0d0281499.jpg',
      ]

      mount(
        <ThemeProvider theme={theme}>
          <ImageScroller
            images={images}
            selectedImage={selectedImage}
            onSelectImage={selectImage}/>
        </ThemeProvider>
      )
    })

    it('should display all images', () => {
      images.forEach((img) => {
        cy.get(`[title="${img}"]`).should('have.css', 'background-image', `url("${img}")`)
      })
    })

    it('should select an image', () => {
      cy.get('.image-card').first().click().then(() => {
        expect(selectedImage).to.equal(images[0])
      })
    })
  })

  describe('with many images', () => {
    const images = [...new Array(100)].map((_val, idx) => idx.toString())

    beforeEach(() => {
      mount(
        <ThemeProvider theme={theme}>
          <ImageScroller
            images={images}
            selectedImage={null}
            onSelectImage={() => {}}
          />
        </ThemeProvider>
      )
    })

    it('should display "load more" button', () => {
      cy.contains(/load more/i)
    })

    it('should load more images', () => {
      cy.get('.image-card').should('have.length', 20)
      cy.get('#load-more').click().then(() => {
        cy.get('.image-card').should('have.length', 40)
      })
    })
  })
})
