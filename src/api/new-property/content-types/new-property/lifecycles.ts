import { sendNewProperty } from "../../../../utils/Email";

export default {
  // After a NewProperty is created in DB, send an email to the user
  async afterCreate(event) {
    const { result } = event;
    const entry = await strapi.entityService.findOne('api::new-property.new-property', result.id, { populate: ['contact', 'property_type'] } );
    // do something to the result;
    await sendNewProperty(entry);
  },
};
