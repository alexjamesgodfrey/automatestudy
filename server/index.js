const OneDrive = require('./flows/onedrive.js')

const refresh_time = 5000
OneDrive.refreshAccessTokens(refresh_time)
OneDrive.executeOneDriveFlows(refresh_time)