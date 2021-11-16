#!/usr/bin/env node
const notionPage = require('../notion/page')
const notion = require('../notion/notion.js')

//notion.getAccessToken('6faa520d-12f3-4997-84d8-417f8f7ba2c9', '5')
//notionPage.createPage('secret_GuT28RSGQVKBbfDeqguGaeyKdtu8tOyOaioONxaSzAB')
//notionPage.listPages('secret_GuT28RSGQVKBbfDeqguGaeyKdtu8tOyOaioONxaSzAB')
//notionPage.formParent('secret_GuT28RSGQVKBbfDeqguGaeyKdtu8tOyOaioONxaSzAB', 'cde4d8d3-8cfa-461e-ac1d-2d3725053143', ['MATH1120', 'CS1110', 'ASIAN2299'])
notionPage.createPageInDatabase(
    'secret_GuT28RSGQVKBbfDeqguGaeyKdtu8tOyOaioONxaSzAB', 
    '21ce33b7-2204-49a6-a67b-b1b237621a61',
    'Custom Page Title',
    new Date().toISOString().substring(0, 10),
    'MATH1120'
)

