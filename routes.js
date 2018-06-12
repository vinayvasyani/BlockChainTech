/**
 * Author : Vinay Vasyani
 * Adding next-routes so we add dynamic routing to application as new project campaigns are created. 
 * 
 */
const routes = require('next-routes')();

routes
    .add('/campaigns/new','/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;