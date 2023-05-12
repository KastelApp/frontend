async function redirect() {
    return [
        {
            source: '/discord',
            destination: 'https://discord.gg/f5HgvkRbVP',
            permanent: true,
        },
        {
            source: '/github',
            destination: 'https://github.com/Kastelll',
            permanent: true,
        },
        {
            source: '/docs',
            destination: 'https://docs.kastelapp.com/',
            permanent: true,
        },
        {
            source: '/status',
            destination: 'https://status.kastelapp.com/',
            permanent: true,
        },
    ]
}

module.exports = redirect