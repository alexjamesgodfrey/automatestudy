const OneDrive = require("./flows/onedrive.js")

const Notion = require("./flows/notion.js")

const access_token_refresh = 3300000
const flow_refresh_time = 900000
OneDrive.refreshAccessTokens(access_token_refresh)
OneDrive.executeOneDriveFlows(flow_refresh_time)
