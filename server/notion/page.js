const { Client } = require('@notionhq/client');

/**
 * Returns a list of all non-archived page id's users Notion
 * @param {String} access_token the users Notion access token.
 */
const listPages = async (access_token) => {
    const notion = new Client({ auth: access_token });
    const response = await notion.search();
    console.log(response)
    // return response.results.map(page => {
    //     if (page.archived == false){ 
    //         return page.id
    //     }
    // })
}


/**
 * Function createMasterDatabase creates the master database that will hold all 
 * of the user's class notes
 * @param {String} access_token the user's Notion access code
 * @param {String} page_id the page_id in which to create the database
 * @param {String} classes_array list of classes to use as multi_select property
 */
const createMasterDatabase = async (access_token, page_id, classes_array) => {
    console.log('Creating master database for user ' + access_token)
    const notion = new Client({ auth: access_token });

    const colors = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"]
    const classes = classes_array.map(c => {
        return {
            name: c,
            color: colors[Math.floor(Math.random() * 7)]
        }
    })

    const createDatabase = await notion.databases.create({
        parent: {
            type: "page_id",
            page_id: page_id 
        },
        icon: {
            type: "emoji",
            emoji: "🖋️"
        },
        title: [
            {
                type: "text",
                text: {
                    "content": "MASTER DATABASE",
                    "link": null
                }
            }
        ],
        properties: {
            Name: {
                title: {}
            },
            Date: {
                date: {}
            },
            "Class": {
                multi_select: {
                    options: classes
                }
            },
            "Next Task": {
                formula: {
                    expression: `if(prop("📓Create") == true, if(prop("📓R1") == true, if(prop("📓R2") == true, if(prop("📓R3") == true, if(prop("📓R4") == true, "Fully Reviewed", "[" + formatDate(dateAdd(prop("Date"), 30, "days"), "M/D/YY") + "] Fourth Review"), "[" + formatDate(dateAdd(prop("Date"), 7, "days"), "M/D/YY") + "] Third Review"), "[" + formatDate(dateAdd(prop("Date"), 3, "days"), "M/D/YY") + "] Second Review"), "[" + formatDate(dateAdd(prop("Date"), 1, "days"), "M/D/YY") + "] First Review"), "[" + formatDate(prop("Date"), "M/D/YY") + "] Create Review Questions")`
                }
            },
            "📓Create": {
                checkbox: {}
            },
            "📓R1": {
                checkbox: {}
            },
            "📓R2": {
                checkbox: {}
            },
            "📓R3": {
                checkbox: {}
            },
            "📓R4": {
                checkbox: {}
            },
        }
    });
    console.log('Database information:')
    console.log(createDatabase)
}


/**
 * Function formParent (1) clears the desired page of all blocks (2) creates a 
 * database in the page. 
 * @param {String} access_token the user's Notion access token
 * @param {String} page_id the id of the page
 * @param {Array} classes_array array of the user's classes
 */
const formParent = async (access_token, page_id, classes_array) => {
    const notion = new Client({ auth: access_token });

    //delete all page content
    const pageBlocks = await notion.blocks.children.list({
        block_id: page_id,
        page_size: 100,
    });
    const pageBlockList = pageBlocks.results.map(block => block.id)
    for (let i=0; i<pageBlockList.length; i++) {
        const response = await notion.blocks.delete({
            block_id: pageBlockList[i],
        });
    }

    createMasterDatabase(access_token, page_id, classes_array)
}

/**
 * Creates a page in notion in database_id database
 * @param {String} access_token the user's Notion access token
 * @param {String} database_id database id to create page in
 * @param {String} page_title title of the page 
 * @param {String} date ISO8601 string of desired date
 * @param {String} class_name name of the class property
 */
const createPageInDatabase = async (access_token, database_id, page_title, date, class_name) => {
    const notion = new Client({ auth: access_token });
    const response = await notion.pages.create({
        parent: {
            database_id: database_id,
        },
        icon: {
            type: "emoji",
            emoji: "✏️"
        },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: page_title,
                        },
                    },
                ],
            },
            Class: {
                multi_select: [
                    {
                        name: class_name
                    },
                ]
            },
            Date: {
                date: 
                    {
                        start: date
                    }
            }
        },
        children: [
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    text: [
                        {
                            type: "text",
                            text: {
                                content: `[${new Date().toLocaleString()}] Entry `,
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: `${page_title} `,
                            }, 
                            annotations: {
                                italic: true
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: `created by `,
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: `studyflow.ai`,
                                link: {
                                    url: "https://studyflow.ai"
                                }
                            },
                            annotations: {
                                bold: true
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: `.`,
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: "bulleted_list_item",
                bulleted_list_item: {
                    text: [
                        {
                            type: "text",
                            text: {
                                content: 'Scroll up to view page properties: create questions or review based on '
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: 'Next Task '
                            },
                            annotations: {
                                bold: true
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: 'property.'
                            }
                        },
                    ]
                }
            },
            {
                object: 'block',
                type: "bulleted_list_item",
                bulleted_list_item: {
                    text: [
                        {
                            type: "text",
                            text: {
                                content: 'Please view the '
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: 'FAQ ',
                                link: {
                                    url: 'https://studyflow.ai'
                                }
                            },
                            annotations: {
                                bold: true
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: 'or '
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: 'contact us',
                                link: {
                                    url: 'https://studyflow.ai'
                                }
                            },
                            annotations: {
                                bold: true
                            }
                        },
                        {
                            type: "text",
                            text: {
                                content: ' with questions, and enjoy studying efficiently!'
                            }
                        },
                    ]
                }
            },
            {
                object: 'block',
                type: "heading_2",
                //...other keys excluded
                heading_2: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": "Active Recall Questions",
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
            {
                object: 'block',
                type: 'toggle',
                toggle: {
                    text: [
                        {
                            type: 'text',
                            text: {
                                content: ' '
                        }
                    }],
                }
            },
          ],
    });
    console.log(response);
}

module.exports = {listPages, createPageInDatabase, formParent}