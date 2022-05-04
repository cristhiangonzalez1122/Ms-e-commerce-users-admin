import {Entity, hasMany, model, property} from '@loopback/repository';
import {PermisoRole} from './permiso-role.model';
import {Permiso} from './permiso.model';
import {Usuario} from './usuario.model';

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @hasMany(() => Usuario, {keyTo: 'id_role'})
  usuarios: Usuario[];

  @hasMany(() => Permiso, {
    through: {
      model: () => PermisoRole,
      keyFrom: 'id_role',
      keyTo: 'id_permiso',
    },
  })
  tienePermisos: Permiso[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
