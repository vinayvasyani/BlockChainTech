/**
 * Author : Vinay Vasyani
 * Adding server.js file to use the routes moudule 
 * Most code is documented in the next-routes documentation which could be found on
 * https://github.com/fridays/next-routes
 * Note : Becase we now use server.js , the app will start with following entry in package.json scripts entry
 *  "dev", "node server.js"
 * Without server.js, we started app with following entry in scripts entry of package.json
 * "dev": "next dev" <--- use this when no server.js is present . 
 * App starts with cmd $> npm run dev
 */
const next = require('next');
const routes = require('./routes');
const { createServer } = require('http');


const app = next ({
        dev : process.env.NODE_ENV !== 'production'
});

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if(err) throw err;
        
        console.log('Ready on localhost : 3000')

    });
  });


