export const typeOfEnvironment =
  process.env.NODE_ENV === "production" ? "2" : "1";
export const typeOfEmission = 1;

// codigos de tipos de documentos
export const codeTypeInvoice = "01";

export const urlReception =
  "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl";

export const urlAuthorization =
  "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl";

export const valuesTaxes: { [taxex: string]: string } = {
  iva: "2",
  ICE: "3",
  IRBPNR: "5",
};

export const percentsCodesIva: { [percent: string]: string } = {
  "0": "0",
  "12": "2",
  "14": "3",
  "No Objeto de Impuesto": "6",
  "Excento de IVA": "7",
};
