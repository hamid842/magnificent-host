import updateListingsJob from "../src/jobs/update_listings";
import generateSitemap from "../src/jobs/generate_sitemap";

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: {...updateListingsJob, ...generateSitemap},
  },
});
