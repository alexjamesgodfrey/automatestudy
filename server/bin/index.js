#!/usr/bin/env node
const notionPage = require('../notion/page')
const notion = require('../notion/notion.js')

//notion.getAccessToken('315220ee-aabc-46b1-bf64-810dc6009b59', '5')
//notionPage.createPage('secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn')
//notionPage.listPages('secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn')
//notionPage.formParent('secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn', 'cde4d8d3-8cfa-461e-ac1d-2d3725053143', ['MATH1120', 'CS1110', 'ASIAN2299'], 5)
// const d = new Date()
// d.setHours(d.getHours() -1)
// notionPage.createPageInDatabase(
//     'secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn',
//     '174bea26-f92e-4d82-b30f-9924d0b807e7',
//     'L1 WELCOME TO STUDYFLOW',
//     d.toISOString().substring(0, 10),
//     'MATH1120'
// )
// notionPage.createWelcomePage(
//     'secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn',
//     '7effd6a9-be9b-4644-9ac9-25672bb8ed5d',
//     d.toISOString().substring(0, 10),
// )

notionPage.formParent(
    'secret_gJ4HSnveMRSRmNxqXfJ8dUnh2mouQGGtDuTvPSiKjjx',
    ['CS2210', 'CS2800', 'MATH2210', 'BIOEE1780'],
    17
)


