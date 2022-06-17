/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable eqeqeq */
import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuration} from '../keys/config';
import {NotificacionCorreo} from '../models';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationsService {
  constructor(/* Add @inject to inject parameters */) {}

  sendEmail(data: NotificacionCorreo): boolean {
    const urlEmail = `${Configuration.urlCorreo}?${Configuration.destinoArg}=${data.destinatario}&${Configuration.asuntoArg}=${data.asunto}&${Configuration.mensajeArg}=${data.mensaje}&${Configuration.hasArg}=${Configuration.hashNotification}`;
    fetch(urlEmail).then((res: any) => {
      return res.text() == 'OK';
    });
    return true;
  }
}
