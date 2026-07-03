// Одна ошибка валидации: какое поле не прошло и почему.
export type ValidationError = {
  field: string;
  message: string;
};
