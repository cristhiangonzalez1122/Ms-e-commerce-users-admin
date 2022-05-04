import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Role, RoleRelations, Usuario, Permiso, PermisoRole} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {PermisoRoleRepository} from './permiso-role.repository';
import {PermisoRepository} from './permiso.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype._id,
  RoleRelations
> {

  public readonly usuarios: HasManyRepositoryFactory<Usuario, typeof Role.prototype._id>;

  public readonly tiene_permisos: HasManyThroughRepositoryFactory<Permiso, typeof Permiso.prototype.id,
          PermisoRole,
          typeof Role.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('PermisoRoleRepository') protected permisoRoleRepositoryGetter: Getter<PermisoRoleRepository>, @repository.getter('PermisoRepository') protected permisoRepositoryGetter: Getter<PermisoRepository>,
  ) {
    super(Role, dataSource);
    this.tiene_permisos = this.createHasManyThroughRepositoryFactoryFor('tiene_permisos', permisoRepositoryGetter, permisoRoleRepositoryGetter,);
    this.registerInclusionResolver('tiene_permisos', this.tiene_permisos.inclusionResolver);
    this.usuarios = this.createHasManyRepositoryFactoryFor('usuarios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
  }
}
