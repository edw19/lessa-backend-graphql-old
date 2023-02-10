import { createClientAsync } from "soap";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import fs from "fs";
import { urlReception, urlAuthorization } from "./constants";

export class Soap {
  static async sendVoucher(keyAccess) {
    const firmadoB64 = fs.readFileSync(
      `src/server/services/generated/${keyAccess}.xml`,
      "base64"
    );
    let parametros = { xml: firmadoB64 };
    try {
      const clientReception = await createClientAsync(urlReception);
      const resultReception = await clientReception.validarComprobanteAsync(
        parametros
      );
      console.log(resultReception[1])
      const error =
        resultReception[0].RespuestaRecepcionComprobante?.comprobantes
          ?.comprobante.mensajes.mensaje.tipo === "ERROR";

      if (error) {
        const message =
          resultReception[0].RespuestaRecepcionComprobante?.comprobantes
            ?.comprobante.mensajes.mensaje;
        throw new Error(message.mensaje);
      }
      const state =
        resultReception[0].RespuestaRecepcionComprobante?.estado === "RECIBIDA";
      if (state) {
        fs.unlinkSync(`src/server/services/generated/${keyAccess}.xml`);
      }
    } catch (error) {
      throw new Error(error.message + " AL TRATAR DE ENVIAR COMPROBANTE");
    }
  }
  static async authorizeVoucher(keyAccess) {
    try {
      let paramsAuthorization = { claveAccesoComprobante: keyAccess };
      const clientAuthorization = await createClientAsync(urlAuthorization);
      const resultAuthorization =
        await clientAuthorization.autorizacionComprobanteAsync(
          paramsAuthorization
        );
      console.log(
        resultAuthorization[0].RespuestaAutorizacionComprobante.autorizaciones
          .autorizacion.mensajes
      );
      const state =
        resultAuthorization[0]?.RespuestaAutorizacionComprobante?.autorizaciones
          ?.autorizacion?.estado;
      if (state !== "AUTORIZADO")
        throw new Error(
          "ERROR AL AUTORIZAR COMPROBANTE: " + keyAccess + ` :${state}`
        );

      const dateAuthorization = format(
        new Date(
          resultAuthorization[0]?.RespuestaAutorizacionComprobante?.autorizaciones?.autorizacion?.fechaAutorizacion
        ),
        "PPP pp",
        { locale: es }
      );
      const voucher =
        resultAuthorization[0].RespuestaAutorizacionComprobante.autorizaciones
          .autorizacion.comprobante;
      const numberAuthorization =
        resultAuthorization[0].RespuestaAutorizacionComprobante.autorizaciones
          .autorizacion.numeroAutorizacion;
      const xmlAuthorized = `<?xml version="1.0" encoding="UTF-8"?><autorizacion>
      <estado>${state}</estado>
      <numeroAutorizacion>${numberAuthorization}</numeroAutorizacion>
      <fechaAutorizacion class="fechaAutorizacion">${dateAuthorization}</fechaAutorizacion>
      <comprobante><![CDATA[${voucher}]]></comprobante>
      <mensajes/>
    </autorizacion>`;

      fs.writeFileSync(
        `src/server/services/generated/authorized/${numberAuthorization}.xml`,
        xmlAuthorized
      );
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
