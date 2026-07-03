import {
  JsonApiListResponse,
  JsonApiSingleResponse,
} from '../../core/types/json-api';
import { ResourceType } from '../../core/types/resource-type';
import { DriverAttributes } from './driver-attributes';

// Ответ с одним водителем: { data: { type, id, attributes } }.
export type DriverOutput = JsonApiSingleResponse<
  ResourceType.Drivers,
  DriverAttributes
>;

// Ответ со списком водителей: { meta, data: [...] }.
export type DriverListOutput = JsonApiListResponse<
  ResourceType.Drivers,
  DriverAttributes
>;
