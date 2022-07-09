/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import fetch from 'node-fetch';
import {Configuration} from '../keys/config';
import {Credentials, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuariosService {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
  ) {}

  /*
   * Add service methods here
   */

  async identificarUsuario(credentials: Credentials) {
    const user = await this.usuarioRepository.findOne({
      where: {
        correo: credentials.user,
        clave: credentials.password,
      },
    });
    return user;
  }

  async generarToken(data: Usuario): Promise<string> {
    const urlToken = `${Configuration.UrlTokenGenerator}?${Configuration.argName}=${data.nombre}&${Configuration.argIdPerson}=${data.id}&${Configuration.argRole}=${data.id_role}`;
    let token = '';
    await fetch(urlToken).then(async (res: any) => {
      token = await res.text();
    });
    return token;
  }
}
