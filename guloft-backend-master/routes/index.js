
const mainRouter = require('./user_api.js')

module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use(mainRouter)
};
