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

  try {
    await seedAmenityIcons(strapi);
  } catch (error) {
    console.log(`Error while seeding Amenity Icons: `, error);
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
          userPhoto: `http://localhost:${process.env.PORT}/images/${review.userPhoto}`,
          publishedAt: new Date()
        }
      });
    }
  }
};

const seedAmenityIcons = async (strapi) => {
  const amenities = require('./amenities.json');
  // Update amenities that match the name but don't have category or icon
  for (const amenity of amenities) {
    const entity = await strapi.db.query('api::amenity.amenity').update({
      where: {
        // if (name === name && (!category || !icon))
        name: amenity.name,
        $or: [
          {
            category: { $null: true }
          },
          {
            icon: { $null: true }
          }
        ]
      },
      data: {
        category: amenity.category,
        icon: amenity.icon
      },
    });
  }
};
