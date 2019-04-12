
// Access postgresSQL database and start server


const knex = require('../knex/knex.js');


// Koa - Get job feed
const Koa = require('koa')
const Router = require('koa-router')
const PORT = process.env.PORT || 3001;
const app = new Koa()
var router = new Router()

// error handling
app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  })

  const jobsRouter = new Router()
  // require our external routes and pass in the router
  //  Every route listener is a function,
  //  so we’re basically just attaching all of our functions to the Router() Object.
  // It’s the same as writing it this way,
  // const basicRoutes = require('./routes/basic');basicRoutes({router});
  // just without instantiating a variable:

  require('./routes/jobs')({ jobsRouter })

  // tells the router to use all the routes that are on the object
  app.use(jobsRouter.routes())
  app.use(jobsRouter.allowedMethods())

  // require our external routes and pass in the router
  require('./routes/jobs')({ jobsRouter })
// Facebook pixel & Campaign for ads
// const bizSdk = require('facebook-nodejs-business-sdk');
// const accessToken = 'EAAH0vZC5H3I8BAMmqZBB0wgjyHZCVKltwXV4LVYk4eC4csZBR2JlT2qlz7oK5TKZCQHQru93mU3pmmrVsDbr4mZCMw3PYDgsk6GxlVlnc2PzGejDZAlF6YxG0UloYzTY6dz5kSxYWEQvLqNlfwM6je9ROwiAHZAegip9valSRJkp8gZDZD';
// const accountId = 'act_2294603300601736';

// const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
// const AdAccount = bizSdk.AdAccount;
// const Campaign = bizSdk.Campaign;

// const account = new AdAccount(accountId);
// var campaigns;

// account.read([AdAccount.Fields.name])
//   .then((account) =>{
//     return account.getCampaigns([Campaign.Fields.name], { limit: 10 }) // fields array and params
//   })
//   .then((result) =>{
//     campaigns = result
//     campaigns.forEach((campaign) =>console.log(campaign.name))
//   }).catch(console.error);



// DATABASE



  // tell the server to listen to events on a specific port
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });

  router.get('/pets',(ctx,next) => {
    knex.select().from('pets').timeout(1000)
    .then((rows) => {ctx.router(rows)})
  })

  app.use(router.routes())
  .use(router.allowedMethods());

  // jobsRouter.get('/pets', (req,ctx) => {
  //   knex.select().from('pets').timeout(1000)
  //   .then((rows) => { ctx.get(rows) });
  //   // use the knex variable above to create dynamic queries
  // });

  module.exports = server