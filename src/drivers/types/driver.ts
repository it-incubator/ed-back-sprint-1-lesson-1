export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
}

export type Driver = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string; // e.g., Toyota
  vehicleModel: string; // e.g., Camry
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
  createdAt: Date;
};
