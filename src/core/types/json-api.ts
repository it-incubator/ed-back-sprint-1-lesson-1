import { ResourceType } from './resource-type';

// Переиспользуемые типы-обёртки формата JSON:API (https://jsonapi.org).
// Дженерики: T — тип ресурса (ResourceType), A — форма его атрибутов.
// Благодаря этим типам форма data/type/id/attributes описана один раз,
// а конкретные DTO ресурсов просто подставляют свои T и A (без дублирования).

// Один ресурс: тип + идентификатор + атрибуты.
export type JsonApiResource<T extends ResourceType, A> = {
  type: T;
  id: string;
  attributes: A;
};

// Ответ с одним ресурсом.
export type JsonApiSingleResponse<T extends ResourceType, A> = {
  data: JsonApiResource<T, A>;
};

// Ответ со списком ресурсов (meta пока без метаданных).
export type JsonApiListResponse<T extends ResourceType, A> = {
  meta: Record<string, never>;
  data: JsonApiResource<T, A>[];
};

// Тело запроса на создание: ресурс ещё без id.
export type JsonApiCreateRequest<T extends ResourceType, A> = {
  data: {
    type: T;
    attributes: A;
  };
};

// Тело запроса на обновление: ресурс с id.
export type JsonApiUpdateRequest<T extends ResourceType, A> = {
  data: {
    type: T;
    id: string;
    attributes: A;
  };
};
