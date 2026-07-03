import { Driver } from '../../types/driver';
import { DriverListOutput } from '../../dto/driver.output';
import { mapDriverToResource } from './map-driver-to-output';

// Ответ со списком водителей (JSON:API list). Каждый элемент маппится тем же
// mapDriverToResource, что и одиночный ресурс — без дублирования логики.
export const mapToDriverListOutput = (drivers: Driver[]): DriverListOutput => {
  return {
    meta: {},
    data: drivers.map(mapDriverToResource),
  };
};
