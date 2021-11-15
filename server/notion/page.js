const { Client } = require('@notionhq/client');

/**
 * Returns a list of all page id's users Notion
 * @param {String} access_token the users Notion access token.
 */
const listPages = async (access_token) => {
    const notion = new Client({ auth: access_token });
    const response = await notion.search();
    return response.results.map(page => page.id)
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

module.exports = {createPage, listPages}