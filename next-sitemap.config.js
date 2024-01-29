module.exports = {
    siteUrl: process.env.SITE_URL || 'https://kastelapp.com',
    generateRobotsTxt: true,
    exclude: ['/app/*', '/api/*', '/oauth2/*', '/test']
}