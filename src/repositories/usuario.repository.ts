import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Role} from '../models';
import {RoleRepository} from './role.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {

  public readonly tiene_un: HasOneRepositoryFactory<Role, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(Usuario, dataSource);
    this.tiene_un = this.createHasOneRepositoryFactoryFor('tiene_un', roleRepositoryGetter);
    this.registerInclusionResolver('tiene_un', this.tiene_un.inclusionResolver);
  }
}
