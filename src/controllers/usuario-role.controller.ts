/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Role, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioRoleController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) {}

  @get('/usuarios/{id}/role', {
    responses: {
      '200': {
        description: 'Role belonging to Usuario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async getRole(
    @param.path.string('id') id: typeof Usuario.prototype.id,
  ): Promise<Role> {
    return this.usuarioRepository.tiene_un(id);
  }
}
