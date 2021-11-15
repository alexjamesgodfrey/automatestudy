#!/usr/bin/env node
const notionPage = require('../notion/page')
const notion = require('../notion/notion.js')

//notion.getAccessToken('7199ac34-f964-4504-88d4-f5829632f753', '5')
//notionPage.createPage('secret_DoCxqCrdDosUz5Fu8SGT3sRTEqsw9Q0jg5b5hZQ7ckU')
notionPage.listPages('secret_DoCxqCrdDosUz5Fu8SGT3sRTEqsw9Q0jg5b5hZQ7ckU')