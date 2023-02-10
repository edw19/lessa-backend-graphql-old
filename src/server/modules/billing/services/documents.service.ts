import { format } from "date-fns";
import { ClientsService } from "modules/clients/services/clients.services";
import { CompanyService } from "modules/companies/services/company.services";
import {
  typeOfEnvironment,
  typeOfEmission,
  codeTypeInvoice,
  percentsCodesIva,
  valuesTaxes,
} from "./constants";
import { InputAdditionalInformation, InputTaxes } from "server/modules/products/inputs";
import { KeyAccess } from "./key-access.service";
import { getIva, getSubTotal } from "server/lib";
import { Types } from "mongoose"

type IProductsSale = {
  code: string;
  auxiliaryCode?: string;
  description: string;
  units: number;
  priceBuy: string;
  priceSale: string;
  discount?: string;
  taxes?: InputTaxes;
  additionalInformation?: InputAdditionalInformation[];
}

type IGenerateInvoiceProps = {
  companyId: Types.ObjectId;
  clientId: Types.ObjectId | string;
  products: IProductsSale[];
  total: number;
  tip?: string;
}

export class DocumentService {
  static async generateInvoice({
    companyId,
    clientId,
    total,
    products,
    tip,
  }: IGenerateInvoiceProps): Promise<{ xml: string; keyAccess: string }> {
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();

    const dateOfIssue = format(
      new Date(date.getFullYear(), month, day),
      "dd/MM/yyyy"
    );
    const company = await CompanyService.getCompany(companyId!);
    const client = await ClientsService.getClient(clientId);
    const sequential = CompanyService.getSequential(company!.sequential);
    const keyAccess = KeyAccess.generateKeyAccess({
      ruc: company?.ruc,
      voucher: "01",
      environment: "1",
      serie: CompanyService.getSerie(
        company!.establishmentCode,
        company!.emissionPoint
      ),
      sequential,
    });
    let xml = "";
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<factura id="comprobante" version="1.0.0">\n';
    // info Tributaria
    xml += `    <infoTributaria>
        <ambiente>${typeOfEnvironment}</ambiente>
        <tipoEmision>${typeOfEmission}</tipoEmision>
        <razonSocial>${company?.businessName}</razonSocial>
        <nombreComercial>${company?.tradename}</nombreComercial>
        <ruc>${company?.ruc}</ruc>
        <claveAcceso>${keyAccess}</claveAcceso>
        <codDoc>${codeTypeInvoice}</codDoc>
        <estab>001</estab>
        <ptoEmi>001</ptoEmi>
        <secuencial>${sequential}</secuencial>
        <dirMatriz>${company?.mainAddress}</dirMatriz>
    </infoTributaria>\n`;

    xml += "    <infoFactura>\n";
    xml += `        <fechaEmision>${dateOfIssue}</fechaEmision>\n`;
    xml += `        <dirEstablecimiento>${company?.mainAddress}</dirEstablecimiento>\n`;
    xml += `        <obligadoContabilidad>${company?.accounting.toUpperCase()}</obligadoContabilidad>\n`;
    xml += `        <tipoIdentificacionComprador>${client?.typeIdentification}</tipoIdentificacionComprador>\n`;
    xml += `        <razonSocialComprador>${client?.name}</razonSocialComprador>\n`;
    xml += `        <identificacionComprador>${client?.identificationCard}</identificacionComprador>\n`;
    xml += `        <direccionComprador>${client?.address}</direccionComprador>\n`;
    xml += `        <totalSinImpuestos>${getSubTotal(total)}</totalSinImpuestos>\n`; // ojo valor calculado
    xml += "        <totalDescuento>0.00</totalDescuento>\n";
    xml += "        <totalConImpuestos>\n";
    xml += "            <totalImpuesto>\n";
    xml += "                <codigo>2</codigo>\n";
    xml += "                <codigoPorcentaje>2</codigoPorcentaje>\n";
    xml += `                <baseImponible>${getSubTotal(total)}</baseImponible>\n`;
    xml += "                <tarifa>12</tarifa>\n";
    xml += `                <valor>${getIva(getSubTotal(total))}</valor>\n`;
    xml += "            </totalImpuesto>\n";
    xml += "        </totalConImpuestos>\n";
    xml += `        <propina>${tip || "0.00"}</propina>\n`;
    xml += `        <importeTotal>${total}</importeTotal>\n`;
    xml += "        <moneda>DOLAR</moneda>\n";
    xml += "        <pagos>\n";
    xml += "            <pago>\n";
    xml += "                <formaPago>01</formaPago>\n";
    xml += `                <total>${total}</total>\n`;
    xml += "            </pago>\n";
    xml += "        </pagos>\n";
    xml += "    </infoFactura>\n";

    // detalles
    xml += "    <detalles>\n";
    products.forEach((product) => {
      xml += "        <detalle>\n";
      xml += `            <codigoPrincipal>${product.code}</codigoPrincipal>
            <codigoAuxiliar>${product.code}</codigoAuxiliar>
            <descripcion>${product?.description}</descripcion>
            <cantidad>${product.units}</cantidad>
            <precioUnitario>${getSubTotal(+product.priceSale)}</precioUnitario>
            <descuento>0.00</descuento>
            <precioTotalSinImpuesto>${getSubTotal(+(product.units * Number(product.priceSale)).toFixed(2))
        }</precioTotalSinImpuesto>\n`;

      if (product?.additionalInformation) {
        if (product.additionalInformation.length > 0) {
          xml += "            <detallesAdicionales>\n";
          product.additionalInformation?.forEach((info) => {
            xml += `                <detAdicional nombre="${info.name}" valor="${info.value}"></detAdicional>\n`;
          });
          xml += "            </detallesAdicionales>\n";
        }
      }

      // if (product.taxes) {
      xml += "            <impuestos>\n";
      if (product.taxes?.iva) {
        // codigo del porcentaje debo almacenarlo en cada producto
        xml += `            <impuesto>
                  <codigo>${valuesTaxes.iva}</codigo>
                  <codigoPorcentaje>${percentsCodesIva["12"]}</codigoPorcentaje>
                  <tarifa>12</tarifa>
                  <baseImponible>${getSubTotal(+(Number(product.priceSale) * product.units).toFixed(2))}</baseImponible>
                  <valor>${getIva(+getSubTotal(+(Number(product.priceSale) * product.units).toFixed(2)))}</valor>
              </impuesto>\n`;
      }
      xml += "            </impuestos>\n";
      // }
      xml += "        </detalle>\n";
    });
    xml += "    </detalles>\n";
    xml += "    <infoAdicional>\n";
    xml += `        <campoAdicional nombre="Nombre">${client?.name}</campoAdicional>\n`;
    xml += `        <campoAdicional nombre="Teléfono">${client?.phone}</campoAdicional>\n`;
    xml += `        <campoAdicional nombre="Dirección">${client?.address}</campoAdicional>\n`;
    xml += "    </infoAdicional>\n";
    xml += "</factura>";
    return { xml, keyAccess };
  }
}
