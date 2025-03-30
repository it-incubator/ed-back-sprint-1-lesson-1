import { ValidationError } from '../../drivers/types/validationError';

export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};
