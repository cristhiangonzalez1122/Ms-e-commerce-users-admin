import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {PermisoRole, PermisoRoleRelations} from '../models';

export class PermisoRoleRepository extends DefaultCrudRepository<
  PermisoRole,
  typeof PermisoRole.prototype.id,
  PermisoRoleRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(PermisoRole, dataSource);
  }
}
