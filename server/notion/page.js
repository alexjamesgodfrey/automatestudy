const { Client } = require('@notionhq/client');
require("dotenv").config();
const moment = require('moment')
var log4js = require("log4js");
log4js.configure({
    appenders: {
      everything: { type: 'file', filename: 'log.log' }
    },
    categories: {
      default: { appenders: [ 'everything' ], level: 'trace' }
    }
});
var logger = log4js.getLogger();

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
 * @param {String} user_id the user's primary key from users database
 */
const createMasterDatabase = async (access_token, page_id, classes_array, user_id) => {
    logger.trace("Creating master database for " + access_token)
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
    await fetch(`${process.env.BASE_REQUEST_URL}/api/notioninformation/database/${user_id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createDatabase)
    })

    //create welcome page
    const d = new Date()
    d.setHours(d.getHours() -1)
    createWelcomePage(access_token, createDatabase.id, d.toISOString().substring(0, 10))
}


/**
 * Function formParent (1) clears the desired page of all blocks (2) creates a 
 * database in the page. 
 * @param {String} access_token the user's Notion access token
 * @param {String} page_id the id of the page
 * @param {Array} classes_array array of the user's classes
 * @param {String} user_id the user's primary key from the users database
 */
const formParent = async (access_token, page_id, classes_array, user_id) => {
    logger.level = "trace";
    logger.trace("Forming parent for " + access_token);
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

    const response = await notion.blocks.children.append({
        block_id: page_id,
        children: [
          {
            object: 'block',
            type: 'callout',
            "callout": {
                "text": [
                    {
                        "type": "text",
                        "text": {
                            "content": "Click below to view all your notes",
                            "link": null
                        },
                        "plain_text": "Click below to view all your notes",
                        "href": null
                    }
                ],
                "icon": {
                    "type": "emoji",
                    "emoji": "💡"
                }
            }
          },
        ],
      });

    createMasterDatabase(access_token, page_id, classes_array, user_id)
}

const createWelcomePage = async (access_token, database_id, date) => {
    logger.trace("Creating welcome page for " + access_token)

    const notion = new Client({ auth: access_token });
    
    const response = await notion.pages.create({
        parent: {
            database_id: database_id,
        },
        icon: {
            type: "emoji",
            emoji: "🚨"
        },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: "WELCOME TO STUDYFLOW",
                        },
                    },
                ],
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
                                content: "WELCOME TO STUDYFLOW ",
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
                type: "heading_3",
                heading_3: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": "SECTION 1: A THANK YOU",
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: "paragraph",
                paragraph: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": ("Alex from Studyflow here 👋. Thanks so much for trying out Studyflow--" + 
                                "college is a busy time, and you just took a great step to making it a better experience. " + 
                                "I'm confident that we will save you time and help you learn even more than you already are. " +
                                "If you find a bug or need any assistance at all, please don't hesitate to contact us with the above link.\n" +
                                "Best of luck!"),
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: "heading_3",
                heading_3: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": "SECTION 2: REVIEW QUESTIONS TUTORIAL",
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: "paragraph",
                paragraph: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": ('On the day you take notes, you should create review questions. These are known as "active recall quetions" and answering them periodically helps you learn quickly ' +
                                "Below are the three possible question types to ask in your toggles. " +
                                "But please experiment! As the Studyflow community grows, more efficient ways of studying will be discovered--" +
                                "and we will all benefit from them."),
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
                                content: 'TYPE 1: FILL IN THE BLANK -- There are ___ ______ants in the world'
                        }
                    }],
                    "children":[{
                        type: "paragraph",
                        paragraph: {
                            text: [
                                {
                                    type: "text",
                                    text: {
                                        "content": ("one quadrillion"),
                                        "link": {
                                            url: 'https://www.combatbugs.com/en/pest-identification/bug-files/how-many-ants-are-there-in-the-world'
                                        }
                                    }
                                }
                            ]
                        }
                    }]
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
                                content: 'TYPE 2: SIMPLE QUESTION -- What is the lifespan of a black garden ant?'
                        }
                    }],
                    "children":[{
                        type: "paragraph",
                        paragraph: {
                            text: [
                                {
                                    type: "text",
                                    text: {
                                        "content": ("4 years"),
                                        "link": {
                                            url: 'https://en.wikipedia.org/wiki/Black_garden_ant'
                                        }
                                    }
                                }
                            ]
                        }
                    }]
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
                                content: 'TYPE 3: LIST QUESTION -- What are the three most common ant types?'
                        }
                    }],
                    "children":[{
                        type: "paragraph",
                        paragraph: {
                            text: [
                                {
                                    type: "text",
                                    text: {
                                        "content": ("1. Carpenter Ants 2. Odorous House Ants 3. Pavement Ants"),
                                        "link": {
                                            url: 'https://www.pestworld.org/news-hub/guest-columnists/the-three-most-common-ant-species/'
                                        }
                                    }
                                }
                            ]
                        }
                    }]
                }
            },
            {
                object: 'block',
                type: "heading_3",
                heading_3: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": "SECTION 3: REVIEW PERIODICALLY",
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: "paragraph",
                paragraph: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": ('After you create your review questions, you will be prompted periodically (1 day, 3 days, 7 days, and 30 days after creation) ' +
                                'to answer your questions. Refer to the page properties at the top of the page. The "Next Task" property will tell you when to review next. After review, check the RX (e.g., R1 for first review) box. ' +
                                "The Next Task property will automatically generate your next review date. We suggest you check your MASTER DATABASE every day for review."),
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: "heading_3",
                heading_3: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": "SECTION 4: PRACTICE PROBLEMS",
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                object: 'block',
                type: "paragraph",
                paragraph: {
                    text: [
                        {
                            type: "text",
                            text: {
                                "content": ('For classes focused on computation, like Calculus, ' + 
                                'it is important to do practice problems. We recommend you create checkboxes to complete practice problems during each review.'),
                                "link": null
                            }
                        }
                    ]
                }
            },
            {
                "type": "to_do",
                "to_do": {
                  "text": [{
                    "type": "text",
                    "text": {
                      "content": "3 practice problems from section 6.2",
                      "link": null
                    }
                  }],
                  "checked": false,
                }
              }
          ],
    });
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

module.exports = {listPages, createPageInDatabase, formParent, createWelcomePage}