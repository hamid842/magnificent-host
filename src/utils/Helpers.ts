import moment from "moment";

export const dateUTCtoLocal = (utcDate: Date): Date => {
  const utc = moment.utc(utcDate);
  return moment(utc).local().toDate();
}
