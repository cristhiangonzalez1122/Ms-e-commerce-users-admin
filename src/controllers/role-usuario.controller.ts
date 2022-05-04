/* eslint-disable @typescript-eslint/naming-convention */
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
import {Role, Usuario} from '../models';
import {RoleRepository} from '../repositories';

export class RoleUsuarioController {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
  ) {}

  @get('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Array of Role has many Usuario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuario)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.roleRepository.usuarios(id).find(filter);
  }

  @post('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Role.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuarioInRole',
            exclude: ['id'],
            optional: ['id_role'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    return this.roleRepository.usuarios(id).create(usuario);
  }

  @patch('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Role.Usuario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Partial<Usuario>,
    @param.query.object('where', getWhereSchemaFor(Usuario))
    where?: Where<Usuario>,
  ): Promise<Count> {
    return this.roleRepository.usuarios(id).patch(usuario, where);
  }

  @del('/roles/{id}/usuarios', {
    responses: {
      '200': {
        description: 'Role.Usuario DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Usuario))
    where?: Where<Usuario>,
  ): Promise<Count> {
    return this.roleRepository.usuarios(id).delete(where);
  }
}
