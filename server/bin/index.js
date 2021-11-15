#!/usr/bin/env node
const notionPage = require('../notion/page')
const notion = require('../notion/notion.js')

//notion.getAccessToken('5bea7791-272f-4f76-a63b-b6bfba4a23d8', '5')
//notionPage.createPage('secret_DoCxqCrdDosUz5Fu8SGT3sRTEqsw9Q0jg5b5hZQ7ckU')
//notionPage.listPages('secret_GuT28RSGQVKBbfDeqguGaeyKdtu8tOyOaioONxaSzAB')
notionPage.formPage('secret_GuT28RSGQVKBbfDeqguGaeyKdtu8tOyOaioONxaSzAB', '8b6815e0-b4e7-4eca-8b8f-973b00148ae4', ['MATH1120', 'CS1110', 'ASIAN2299'])
