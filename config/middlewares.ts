export default [
  'strapi::errors',
  'strapi::security',
  // 'strapi::cors',
  {
    name: "strapi::cors",
    config: {
      origin: ['*'],
      headers: ['*'],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
