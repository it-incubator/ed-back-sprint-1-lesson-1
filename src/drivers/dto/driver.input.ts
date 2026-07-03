import {
  JsonApiCreateRequest,
  JsonApiUpdateRequest,
} from '../../core/types/json-api';
import { ResourceType } from '../../core/types/resource-type';
import { DriverAttributes } from './driver-attributes';

// Тело запроса на создание водителя: { data: { type, attributes } }.
export type DriverCreateInput = JsonApiCreateRequest<
  ResourceType.Drivers,
  DriverAttributes
>;

// Тело запроса на обновление: { data: { type, id, attributes } }.
export type DriverUpdateInput = JsonApiUpdateRequest<
  ResourceType.Drivers,
  DriverAttributes
>;
