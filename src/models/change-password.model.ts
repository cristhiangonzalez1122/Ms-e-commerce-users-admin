import {Model, model, property} from '@loopback/repository';

@model()
export class ChangePassword extends Model {
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  currentPassword: string;

  @property({
    type: 'string',
    required: true,
  })
  newPassword: string;

  constructor(data?: Partial<ChangePassword>) {
    super(data);
  }
}

export interface ChangePasswordRelations {
  // describe navigational properties here
}

export type ChangePasswordWithRelations = ChangePassword &
  ChangePasswordRelations;
