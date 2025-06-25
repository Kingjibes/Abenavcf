import { v4 as uuidv4 } from 'uuid';

const CREATOR_ID_KEY = 'contact_gain_creator_id';

export const getOrCreateCreatorId = () => {
  let creatorId = localStorage.getItem(CREATOR_ID_KEY);
  if (!creatorId) {
    creatorId = uuidv4();
    localStorage.setItem(CREATOR_ID_KEY, creatorId);
  }
  return creatorId;
};