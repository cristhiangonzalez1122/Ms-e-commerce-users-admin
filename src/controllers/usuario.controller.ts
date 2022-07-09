/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {Configuration} from '../keys/config';
import {
  CredencialesRecuperarClave,
  Credentials,
  NotificacionCorreo,
  NotificacionSms,
  Usuario,
} from '../models';
import {ChangePassword} from '../models/change-password.model';
import {UsuarioRepository} from '../repositories';
import {
  AdministradorDeClavesService,
  NotificationsService,
  SesionUsuariosService,
} from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(AdministradorDeClavesService)
    public passwordAdmin: AdministradorDeClavesService,
    @service(NotificationsService)
    public serviceNotification: NotificationsService,
    @service(SesionUsuariosService)
    private servicioSesionUsuario: SesionUsuariosService,
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
      const data = new NotificacionCorreo();
      data.destinatario = usuario.correo;
      data.asunto = Configuration.asuntoCreacionUsuario;
      data.mensaje = `${Configuration.saludo} ${usuario.nombre}" "${usuario.apellidos} <br /> ${Configuration.usuarioCreado} ${password}`;
      this.serviceNotification.sendEmail(data);
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
  ): Promise<Usuario | any> {
    const usuario = await this.servicioSesionUsuario.identificarUsuario(
      credentials,
    );
    let tk = '';

    if (usuario) {
      usuario.clave = '';
      tk = await this.servicioSesionUsuario.generarToken(usuario);
    }
    return {
      token: tk,
      usuario: usuario,
    };
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
    const user = await this.passwordAdmin.changePassword(changepassword);
    if (user) {
      const data = new NotificacionCorreo();
      data.destinatario = user.correo;
      data.asunto = Configuration.asuntoCambioClave;
      data.mensaje = `${Configuration.saludo} ${user.nombre}" "${user.apellidos} <br /> ${Configuration.changePasswordMessage}`;
      this.serviceNotification.sendEmail(data);
    }
    return user != null;
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
    credenciales: CredencialesRecuperarClave,
  ): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.email,
      },
    });
    if (user) {
      const clave = this.passwordAdmin.generatePassword();
      const claveCifrada = this.passwordAdmin.encryptText(clave);
      user.clave = this.passwordAdmin.encryptText(claveCifrada);
      await this.usuarioRepository.updateById(user.id, user);
      const data = new NotificacionSms();
      data.destino = user.celular;
      data.mensaje = `${Configuration.saludo} ${user.nombre} ${user.apellidos}${Configuration.mensajeRecuperarClave} ${clave}`;
      this.serviceNotification.sendSms(data);
    }
    return user;
  }
}
