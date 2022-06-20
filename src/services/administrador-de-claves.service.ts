import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Usuario} from '../models';
import {ChangePassword} from '../models/change-password.model';
import {UsuarioRepository} from '../repositories';
const generator = require('generate-password');
const CryptoJS = require('crypto-js');

@injectable({scope: BindingScope.TRANSIENT})
export class AdministradorDeClavesService {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) {}

  async changePassword(
    changepassword: ChangePassword,
  ): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({
      where: {
        id: changepassword.userId,
        clave: changepassword.currentPassword,
      },
    });
    if (user) {
      user.clave = changepassword.newPassword;
      await this.usuarioRepository.updateById(changepassword.userId, user);
      return user;
    } else {
      return null;
    }
  }

  generatePassword(): string {
    const password = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true,
    });
    return password;
  }

  encryptText(text: string) {
    const encrypt = CryptoJS.MD5(text).toString();
    return encrypt;
  }
}
