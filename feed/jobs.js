const request = require("superagent");
const knex = require("../knex/knex");

const feed = "https://api.workbuster.com/jobs/feed/kyhdemo?format=json";

module.exports = ({ router }) => {
  router.get("/jobslength", async (ctx, next) => {
    await request.get(feed).then(res => {
      const jobs = res.body.jobs;
      ctx.body = "joblength: " + jobs.length; // REMOVE LATER ON
      var i;
      for (i = 0; i < jobs.length; i++) {
        ctx.body += " i: " + i; // REMOVE LATER ON
      }
    });
  });

  // GET JOBS FROM FEED AND SAVE TO DB
  router.get("/", async (ctx, next) => {
    await request
      .get(feed)
      .then(res => {
        // GET JOB DATA FROM FEED
        const jobs = res.body.jobs;
        const jobObject = {
          id: jobs[0].id,
          title: jobs[0].title,
          description_short: jobs[0].description_short,
          last_application_timestamp: jobs[0].last_application_timestamp,
          published_first_date: jobs[0].published_first_date,
          updated_timestamp: jobs[0].updated_timestamp,
          apply_url: jobs[0].apply_url,
          image: jobs[0].image,
          company: jobs[0].company.name,
          city: jobs[0].company.city || "Ospecificerad stad",
          views: 0,
          clicks: 0,
          applies: 0
        };

        console.log("object", jobObject); // REMOVE LATER ON

        // ADD JOB DATA TO DATABASE
        knex("ads")
          .insert(jobObject)
          .then(function(result) {
            // .then required so that promise is executed
            res.json({ success: true, message: "ok" }); // respond back to request
          });

        ctx.body = [jobObject]; // REMOVE LATER ON
      })

      .catch(err => {
        return ctx.throw(400, "no data to get the api,");
      });
  });
};
