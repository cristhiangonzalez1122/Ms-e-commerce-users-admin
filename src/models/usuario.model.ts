import {Entity, model, property, hasOne} from '@loopback/repository';
import {Role} from './role.model';

@model()
export class Usuario extends Entity {
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

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  clave: string;

  @property({
    type: 'boolean',
    default: true,
  })
  estado?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @hasOne(() => Role, {keyTo: 'id_role'})
  tiene_un: Role;

  @property({
    type: 'string',
  })
  id_role?: string;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
