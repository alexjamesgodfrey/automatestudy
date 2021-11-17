#!/usr/bin/env node
const notionPage = require('../notion/page')
const notion = require('../notion/notion.js')

//notion.getAccessToken('315220ee-aabc-46b1-bf64-810dc6009b59', '5')
//notionPage.createPage('secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn')
//notionPage.listPages('secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn')
//notionPage.formParent('secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn', 'cde4d8d3-8cfa-461e-ac1d-2d3725053143', ['MATH1120', 'CS1110', 'ASIAN2299'], 5)
// notionPage.createPageInDatabase(
//     'secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn', 
//     '6ec51fd6-f131-419a-9d84-cd249030bd40',
//     'L1 WELCOME TO STUDYFLOW',
//     new Date().toISOString().substring(0, 10),
//     'MATH1120'
// )
notionPage.createWelcomePage('secret_NNA9XZlSbctguV8HiuC9aq6HiV659rK3f8HmuXB8Ydn', 'cde4d8d3-8cfa-461e-ac1d-2d3725053143')


