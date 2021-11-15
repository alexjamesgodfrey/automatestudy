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
 * Function formPage (1) clears the desired page of all blocks (2) creates a 
 * database in the page. 
 * @param {String} access_token the user's Notion access token
 * @param {String} page_id the id of the page
 * @param {Array} classes_array array of the user's classes
 */
const formPage = async (access_token, page_id, classes_array) => {
    const notion = new Client({ auth: access_token });

    //delete all page content
    const pageBlocks = await notion.blocks.children.list({
        block_id: page_id,
        page_size: 100,
    });
    console.log(pageBlocks)
    const pageBlockList = pageBlocks.results.map(block => block.id)
    console.log(pageBlockList)
    for (let i=0; i<pageBlockList.length; i++) {
        const response = await notion.blocks.delete({
            block_id: pageBlockList[i],
        });
    }

    //creates an object for each class for classes dropdown
    const colors = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"]
    const classes = classes_array.map(c => {
        return {
            name: c,
            color: colors[Math.floor(Math.random() * 7)]
        }
    })

    //create a database in page
    const createDatabase = await notion.databases.create({
        parent: {
            type: "page_id",
            page_id: page_id 
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
            "Name": {
                "title": {}
            },
            "Date": {
                "date": {}
            },
            "Class": {
                "multi_select": {
                    "options": classes
                }
            },
        }
    });



}

/**
 * Creates a database in the top page
 * @param {String} access_token 
 */
const createDatabase = async (access_token) => {

}

/**
 * Creates a page in notion.
 * @param {String} access_token 
 */
const createPage = async (access_token) => {
    const notion = new Client({ auth: access_token });
    const response = await notion.pages.create({
    parent: {
        workspace: true,
    },
    icon: {
        type: "emoji",
            emoji: "🎉"
    },
    cover: {
        type: "external",
        external: {
            url: "https://website.domain/images/image.png"
        }
    },
    properties: {
        Name: {
        title: [
            {
            text: {
                content: 'Tuscan Kale',
            },
            },
        ],
        },
        Description: {
        text: [
            {
            text: {
                content: 'A dark green leafy vegetable',
            },
            },
        ],
        },
        'Food group': {
        select: {
            name: '🥦 Vegetable',
        },
        },
        Price: {
        number: 2.5,
        },
    },
    children: [
        {
        object: 'block',
        type: 'heading_2',
        heading_2: {
            text: [
            {
                type: 'text',
                text: {
                content: 'Lacinato kale',
                },
            },
            ],
        },
        },
        {
        object: 'block',
        type: 'paragraph',
        paragraph: {
            text: [
            {
                type: 'text',
                text: {
                content: 'Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.',
                link: {
                    url: 'https://en.wikipedia.org/wiki/Lacinato_kale',
                },
                },
            },
            ],
        },
        },
    ],
    });
    console.log(response);
}

module.exports = {listPages, createPage, formPage}