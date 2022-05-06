/* eslint-disable @typescript-eslint/naming-convention */
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Role, Usuario, UsuarioRelations} from '../models';
import {RoleRepository} from './role.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {
  public readonly tiene_un: BelongsToAccessor<
    Role,
    typeof Usuario.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(Usuario, dataSource);
    this.tiene_un = this.createBelongsToAccessorFor(
      'tiene_un',
      roleRepositoryGetter,
    );
    this.registerInclusionResolver('tiene_un', this.tiene_un.inclusionResolver);
  }
}
