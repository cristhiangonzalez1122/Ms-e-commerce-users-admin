import {Entity, model, property, hasMany} from '@loopback/repository';
import {Usuario} from './usuario.model';
import {Permiso} from './permiso.model';
import {PermisoRole} from './permiso-role.model';

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
  })
  id_role?: string;

  @hasMany(() => Usuario, {keyTo: 'id_role'})
  usuarios: Usuario[];

  @hasMany(() => Permiso, {through: {model: () => PermisoRole, keyFrom: 'id_role', keyTo: 'id_permiso'}})
  tiene_permisos: Permiso[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
