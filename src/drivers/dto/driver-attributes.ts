import { VehicleFeature } from '../types/driver';

// Атрибуты водителя в терминах JSON:API (поля data.attributes).
// Одни и те же поля используются и во входных запросах, и в ответах.
export type DriverAttributes = {
  name: string;
  phoneNumber: string;
  email: string;

  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};
