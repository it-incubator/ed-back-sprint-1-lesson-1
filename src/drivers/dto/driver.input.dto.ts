import { VehicleFeature } from '../types/driver';

// Данные, которые клиент присылает при создании водителя
// (без служебных id и createdAt — их проставляет сервер).
export type DriverInputDto = {
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
