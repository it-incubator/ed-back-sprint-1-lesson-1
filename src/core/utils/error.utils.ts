import { ValidationError } from '../types/validation-error';

// Оборачивает список ошибок в единый формат ответа: { errorMessages: [...] }.
export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};
