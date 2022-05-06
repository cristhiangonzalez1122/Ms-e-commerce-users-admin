/* eslint-disable @typescript-eslint/naming-convention */
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Credentials, Usuario} from '../models';
import {ChangePassword} from '../models/change-password.model';
import {UsuarioRepository} from '../repositories';
import {AdministradorDeClavesService} from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(AdministradorDeClavesService)
    public passwordAdmin: AdministradorDeClavesService,
  ) {}

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    const password = this.passwordAdmin.generatePassword();
    const encryptPassword = this.passwordAdmin.encryptText(password);
    usuario.clave = encryptPassword;
    const createdUser = await this.usuarioRepository.create(usuario);
    if (createdUser) {
      // enviar clave por email
    }
    return createdUser;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Usuario) where?: Where<Usuario>): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'})
    filter?: FilterExcludingWhere<Usuario>,
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

  /**
   * Metodos Adicionales
   */

  @post('/authenticate-user')
  @response(200, {
    description: 'authenticate User model instance',
    content: {'application/json': {schema: getModelSchemaRef(Credentials)}},
  })
  async authenticateUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials, {
            title: 'authenticate user',
          }),
        },
      },
    })
    credentials: Credentials,
  ): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({
      where: {
        correo: credentials.user,
        clave: credentials.password,
      },
    });
    if (user) {
      //generar un token y agregarlo a la respuesta
    }
    return user;
  }

  @post('/change-password')
  @response(200, {
    description: 'Change User Password',
    content: {'application/json': {schema: getModelSchemaRef(ChangePassword)}},
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChangePassword, {
            title: 'Change your Password',
          }),
        },
      },
    })
    changepassword: ChangePassword,
  ): Promise<boolean> {
    const resp = await this.passwordAdmin.changePassword(changepassword);
    if (resp) {
      //invocar al servicio de notificacion al usuario
    }
    return resp;
  }

  @post('/recover-password')
  @response(200, {
    description: 'recover User Password',
    content: {'application/json': {schema: {}}},
  })
  async recoveryPassword(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    email: string,
  ): Promise<Usuario | null> {
    const user = await this.passwordAdmin.recoverPassword(email);
    if (user) {
      //invocar al servicio de notificacion al usuario con la nueva clave
    }
    return user;
  }
}
