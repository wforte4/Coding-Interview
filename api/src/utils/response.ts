import { ServerError } from '../types/constants/ServerCodes';
import { ServerResponses } from '../types/constants/ServerResponses';

export const sendMessage = (message: ServerResponses | ServerError) => ({
  message,
});
