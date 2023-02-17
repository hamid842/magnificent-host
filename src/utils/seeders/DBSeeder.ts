import BlogSeeder from "./BlogSeeder";

export default async (strapi) => {
  try {
    await seedReviews(strapi);
  } catch (error) {
    console.log(`Error while seeding Reviews: `, error);
  }

  try {
    await BlogSeeder(strapi);
  } catch (error) {
    console.log(`Error while seeding Blogs: `, error);
  }
};

const seedReviews = async (strapi) => {
  const reviews = require('./reviews.json');
  for (const review of reviews) {
    // Find the BlogPost by id
    const entry = await strapi.entityService.findOne('api::review.review', review.id);
    // Create it if it doesn't exist
    if (!entry) {
      const newEntry = await strapi.entityService.create('api::review.review', {
        data: {
          ...review,
          userPhoto: `http://localhost:${process.env.PORT}/images/${review.userPhoto}`
        }
      });
    }
  }
};
