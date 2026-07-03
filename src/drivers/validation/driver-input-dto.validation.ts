import { DriverInputDto } from '../dto/driver.input.dto';
import { VehicleFeature } from '../types/driver';
import { ValidationError } from '../../core/types/validation-error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Строка считается некорректной, если это не строка или её длина (после trim)
// выходит за границы [min, max]. Вынесено отдельно, чтобы не дублировать проверку.
const isInvalidString = (value: unknown, min: number, max: number): boolean =>
  typeof value !== 'string' ||
  value.trim().length < min ||
  value.trim().length > max;

// Ручная валидация тела запроса (на этом этапе — без сторонних библиотек).
// Возвращает список ошибок; пустой список означает, что данные корректны.
export const validateDriverInputDto = (
  data: DriverInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (isInvalidString(data.name, 2, 15)) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }

  if (isInvalidString(data.phoneNumber, 8, 15)) {
    errors.push({ field: 'phoneNumber', message: 'Invalid phoneNumber' });
  }

  if (isInvalidString(data.email, 5, 100) || !EMAIL_REGEX.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email' });
  }

  if (isInvalidString(data.vehicleMake, 3, 100)) {
    errors.push({ field: 'vehicleMake', message: 'Invalid vehicleMake' });
  }

  if (isInvalidString(data.vehicleModel, 2, 100)) {
    errors.push({ field: 'vehicleModel', message: 'Invalid vehicleModel' });
  }

  if (typeof data.vehicleYear !== 'number') {
    errors.push({ field: 'vehicleYear', message: 'Invalid vehicleYear' });
  }

  if (isInvalidString(data.vehicleLicensePlate, 6, 10)) {
    errors.push({
      field: 'vehicleLicensePlate',
      message: 'Invalid vehicleLicensePlate',
    });
  }

  // Описание необязательное: допускается null, иначе — строка нужной длины.
  if (
    data.vehicleDescription !== null &&
    isInvalidString(data.vehicleDescription, 10, 200)
  ) {
    errors.push({
      field: 'vehicleDescription',
      message: 'Invalid vehicleDescription',
    });
  }

  if (!Array.isArray(data.vehicleFeatures)) {
    errors.push({
      field: 'vehicleFeatures',
      message: 'vehicleFeatures must be an array',
    });
  } else {
    const validFeatures = Object.values(VehicleFeature);
    const hasInvalidFeature = data.vehicleFeatures.some(
      (feature) => !validFeatures.includes(feature),
    );

    if (hasInvalidFeature) {
      errors.push({
        field: 'vehicleFeatures',
        message: 'Invalid vehicleFeatures',
      });
    }
  }

  return errors;
};
