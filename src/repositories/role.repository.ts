import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Permiso, PermisoRole, Role, RoleRelations, Usuario} from '../models';
import {PermisoRoleRepository} from './permiso-role.repository';
import {PermisoRepository} from './permiso.repository';
import {UsuarioRepository} from './usuario.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  public readonly usuarios: HasManyRepositoryFactory<
    Usuario,
    typeof Role.prototype.id
  >;

  public readonly tienePermisos: HasManyThroughRepositoryFactory<
    Permiso,
    typeof Permiso.prototype.id,
    PermisoRole,
    typeof Role.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('UsuarioRepository')
    protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
    @repository.getter('PermisoRoleRepository')
    protected permisoRoleRepositoryGetter: Getter<PermisoRoleRepository>,
    @repository.getter('PermisoRepository')
    protected permisoRepositoryGetter: Getter<PermisoRepository>,
  ) {
    super(Role, dataSource);
    this.tienePermisos = this.createHasManyThroughRepositoryFactoryFor(
      'tienePermisos',
      permisoRepositoryGetter,
      permisoRoleRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tienePermisos',
      this.tienePermisos.inclusionResolver,
    );
    this.usuarios = this.createHasManyRepositoryFactoryFor(
      'usuarios',
      usuarioRepositoryGetter,
    );
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
  }
}
