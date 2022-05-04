/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model()
export class PermisoRole extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  id_role?: string;

  @property({
    type: 'string',
  })
  id_permiso?: string;

  constructor(data?: Partial<PermisoRole>) {
    super(data);
  }
}

export interface PermisoRoleRelations {
  // describe navigational properties here
}

export type PermisoRoleWithRelations = PermisoRole & PermisoRoleRelations;
