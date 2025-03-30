import { DriverInputDto } from '../dto/driver.input-dto';
import { VehicleFeature } from '../types/driver';
import { ValidationError } from '../types/validationError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const vehicleInputDtoValidation = (
  data: DriverInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 15
  ) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }

  if (
    !data.phoneNumber ||
    typeof data.phoneNumber !== 'string' ||
    data.phoneNumber.trim().length < 8 ||
    data.phoneNumber.trim().length > 15
  ) {
    errors.push({ field: 'phoneNumber', message: 'Invalid phoneNumber' });
  }

  if (
    !data.email ||
    typeof data.email !== 'string' ||
    data.email.trim().length < 5 ||
    data.email.trim().length > 100 ||
    !EMAIL_REGEX.test(data.email)
  ) {
    errors.push({ field: 'email', message: 'Invalid email' });
  }

  if (
    !data.vehicleMake ||
    typeof data.vehicleMake !== 'string' ||
    data.vehicleMake.trim().length < 3 ||
    data.vehicleMake.trim().length > 100
  ) {
    errors.push({ field: 'vehicleMake', message: 'Invalid vehicleMake' });
  }

  if (
    !data.vehicleModel ||
    typeof data.vehicleModel !== 'string' ||
    data.vehicleModel.trim().length < 2 ||
    data.vehicleModel.trim().length > 100
  ) {
    errors.push({ field: 'vehicleModel', message: 'Invalid vehicleModel' });
  }

  if (!data.vehicleYear || typeof data.vehicleYear !== 'number') {
    errors.push({ field: 'vehicleYear', message: 'Invalid vehicleYear' });
  }

  if (
    !data.vehicleLicensePlate ||
    typeof data.vehicleLicensePlate !== 'string' ||
    data.vehicleLicensePlate.trim().length < 6 ||
    data.vehicleLicensePlate.trim().length > 10
  ) {
    errors.push({
      field: 'vehicleLicensePlate',
      message: 'Invalid vehicleLicensePlate',
    });
  }

  if (
    data.vehicleDescription !== null &&
    (typeof data.vehicleDescription !== 'string' ||
      data.vehicleDescription.trim().length < 10 ||
      data.vehicleDescription.trim().length > 200)
  ) {
    errors.push({
      field: 'vehicleDescription',
      message: 'Invalid vehicleDescription',
    });
  }

  if (!Array.isArray(data.vehicleFeatures)) {
    errors.push({
      field: 'vehicleFeatures',
      message: 'vehicleFeatures must be array',
    });
  } else if (data.vehicleFeatures.length) {
    const existingFeatures = Object.values(VehicleFeature);
    if (
      data.vehicleFeatures.length > existingFeatures.length ||
      data.vehicleFeatures.length < 1
    ) {
      errors.push({
        field: 'vehicleFeatures',
        message: 'Invalid vehicleFeatures',
      });
    }
    for (const feature of data.vehicleFeatures) {
      if (!existingFeatures.includes(feature)) {
        errors.push({
          field: 'features',
          message: 'Invalid vehicleFeature:' + feature,
        });
        break;
      }
    }
  }

  return errors;
};
