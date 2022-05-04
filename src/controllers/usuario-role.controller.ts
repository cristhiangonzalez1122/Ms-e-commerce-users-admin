import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Usuario,
  Role,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioRoleController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/role', {
    responses: {
      '200': {
        description: 'Usuario has one Role',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Role>,
  ): Promise<Role> {
    return this.usuarioRepository.tiene_un(id).get(filter);
  }

  @post('/usuarios/{id}/role', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRoleInUsuario',
            exclude: ['_id'],
            optional: ['id_role']
          }),
        },
      },
    }) role: Omit<Role, '_id'>,
  ): Promise<Role> {
    return this.usuarioRepository.tiene_un(id).create(role);
  }

  @patch('/usuarios/{id}/role', {
    responses: {
      '200': {
        description: 'Usuario.Role PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Partial<Role>,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.usuarioRepository.tiene_un(id).patch(role, where);
  }

  @del('/usuarios/{id}/role', {
    responses: {
      '200': {
        description: 'Usuario.Role DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.usuarioRepository.tiene_un(id).delete(where);
  }
}
