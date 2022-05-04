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
Role,
PermisoRole,
Permiso,
} from '../models';
import {RoleRepository} from '../repositories';

export class RolePermisoController {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
  ) { }

  @get('/roles/{id}/permisos', {
    responses: {
      '200': {
        description: 'Array of Role has many Permiso through PermisoRole',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Permiso)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Permiso>,
  ): Promise<Permiso[]> {
    return this.roleRepository.tiene_permisos(id).find(filter);
  }

  @post('/roles/{id}/permisos', {
    responses: {
      '200': {
        description: 'create a Permiso model instance',
        content: {'application/json': {schema: getModelSchemaRef(Permiso)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Role.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permiso, {
            title: 'NewPermisoInRole',
            exclude: ['id'],
          }),
        },
      },
    }) permiso: Omit<Permiso, 'id'>,
  ): Promise<Permiso> {
    return this.roleRepository.tiene_permisos(id).create(permiso);
  }

  @patch('/roles/{id}/permisos', {
    responses: {
      '200': {
        description: 'Role.Permiso PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permiso, {partial: true}),
        },
      },
    })
    permiso: Partial<Permiso>,
    @param.query.object('where', getWhereSchemaFor(Permiso)) where?: Where<Permiso>,
  ): Promise<Count> {
    return this.roleRepository.tiene_permisos(id).patch(permiso, where);
  }

  @del('/roles/{id}/permisos', {
    responses: {
      '200': {
        description: 'Role.Permiso DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Permiso)) where?: Where<Permiso>,
  ): Promise<Count> {
    return this.roleRepository.tiene_permisos(id).delete(where);
  }
}
