import forge from "node-forge";
import fs from "fs";
import btoa from "btoa";
import crytojs from "crypto-js";
import { format } from "date-fns";
import { SIGNATURE_KEY_SECRET } from "config/variables";

export class BillingElectronic {
  static generateXML(keyAccess, secuencial, infoBill) {
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();

    const dateOfIssue = format(
      new Date(date.getFullYear(), month, day),
      "dd/MM/yyyy"
    );

    let xml = "";
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<factura id="comprobante" version="1.0.0">\n';

    // info Tributaria
    xml += "    <infoTributaria>\n";
    xml += "        <ambiente>1</ambiente>\n";
    xml += "        <tipoEmision>1</tipoEmision>\n";
    xml +=
      "        <razonSocial>NARVAEZ MANOSALVAS EDWIN PATRICIO</razonSocial>\n";
    xml +=
      "        <nombreComercial>NARVAEZ MANOSALVAS EDWIN PATRICIO</nombreComercial>\n";
    xml += "        <ruc>0401869706001</ruc>\n";
    xml += `        <claveAcceso>${keyAccess}</claveAcceso>\n`;
    xml += "        <codDoc>01</codDoc>\n";
    xml += "        <estab>001</estab>\n";
    xml += "        <ptoEmi>001</ptoEmi>\n";
    xml += `        <secuencial>${secuencial}</secuencial>\n`;
    xml +=
      "        <dirMatriz>CARCHI / SAN PEDRO DE HUACA / HUACA / 8 DE DICIEMBRE Y GARCIA MORENO</dirMatriz>\n";
    xml += "    </infoTributaria>\n";

    // info factura
    xml += "    <infoFactura>\n";
    xml += `        <fechaEmision>${dateOfIssue}</fechaEmision>\n`;
    xml +=
      "        <dirEstablecimiento>CARCHI / SAN PEDRO DE HUACA / HUACA / 8 DE DICIEMBRE Y GARCIA MORENO</dirEstablecimiento>\n";
    xml += "        <obligadoContabilidad>NO</obligadoContabilidad>\n";
    xml +=
      "        <tipoIdentificacionComprador>05</tipoIdentificacionComprador>\n";
    xml +=
      "        <razonSocialComprador>EDWIN JOSE TATES</razonSocialComprador>\n";
    xml +=
      "        <identificacionComprador>0401869706</identificacionComprador>\n";
    xml +=
      "        <direccionComprador>calle 9 de junio</direccionComprador>\n";
    xml += "        <totalSinImpuestos>20.00</totalSinImpuestos>\n"; // ojo valor calculado
    xml += "        <totalDescuento>0.00</totalDescuento>\n";
    xml += "        <totalConImpuestos>\n";
    xml += "            <totalImpuesto>\n";
    xml += "                <codigo>2</codigo>\n";
    xml += "                <codigoPorcentaje>2</codigoPorcentaje>\n";
    xml += "                <baseImponible>20.00</baseImponible>\n";
    xml += "                <tarifa>12</tarifa>\n";
    xml += "                <valor>2.40</valor>\n";
    xml += "            </totalImpuesto>\n";
    xml += "        </totalConImpuestos>\n";
    xml += "        <propina>0.00</propina>\n";
    xml += "        <importeTotal>22.40</importeTotal>\n";
    xml += "        <moneda>DOLAR</moneda>\n";
    xml += "        <pagos>\n";
    xml += "            <pago>\n";
    xml += "                <formaPago>01</formaPago>\n";
    xml += "                <total>22.40</total>\n";
    xml += "            </pago>\n";
    xml += "        </pagos>\n";
    xml += "    </infoFactura>\n";

    // detalles
    xml += "    <detalles>\n";
    xml += "        <detalle>\n";
    xml += "            <codigoPrincipal>0001</codigoPrincipal>\n";
    xml += "            <descripcion>SOPORTE TECNICO</descripcion>\n";
    xml += "            <cantidad>1</cantidad>\n";
    xml += "            <precioUnitario>20</precioUnitario>\n";
    xml += "            <descuento>0</descuento>\n";
    xml +=
      "            <precioTotalSinImpuesto>20.00</precioTotalSinImpuesto>\n";
    xml += "            <impuestos>\n";
    xml += "                <impuesto>\n";
    xml += "                    <codigo>2</codigo>\n";
    xml += "                    <codigoPorcentaje>2</codigoPorcentaje>\n";
    xml += "                    <tarifa>12</tarifa>\n";
    xml += "                    <baseImponible>20.00</baseImponible>\n";
    xml += "                    <valor>2.40</valor>\n";
    xml += "                </impuesto>\n";
    xml += "            </impuestos>\n";
    xml += "        </detalle>\n";
    xml += "    </detalles>\n";
    xml += "    <infoAdicional>\n";
    xml +=
      '        <campoAdicional nombre="Dirección">calle 9 de junio</campoAdicional>\n';
    xml +=
      '        <campoAdicional nombre="Teléfono">062973284 ext. 062</campoAdicional>\n';
    xml +=
      '        <campoAdicional nombre="Email">edwinpatricionarváezm@gmail.com</campoAdicional>\n';
    xml += "    </infoAdicional>\n";
    xml += "</factura>";
    return xml;
  }
  static signXml(comprobante, keyAccess, signatureInfo) {
    let certificateX509_pem = null;
    let certificateX509 = null;
    let certificateX509_asn1 = null;
    let certificateX509_der = null;
    let certificateX509_der_hash = null;
    let exponent = null;
    let modulus = null;
    let SignedProperties_para_hash = null;
    let KeyInfo_para_hash = null;
    let SignedInfo_para_firma = null;
    let IssuerName = "";
    
    const { signatureKey, signaturePath } = signatureInfo;
    
    const sign = fs.readFileSync(signaturePath);
    const arrayUint8 = new Uint8Array(sign);
    const p12B64 = forge.util.binary.base64.encode(arrayUint8);
    const p12Der = forge.util.decode64(p12B64);
    const p12Asn1 = forge.asn1.fromDer(p12Der);

    const bytesSignatureKey  = crytojs.AES.decrypt(signatureKey, SIGNATURE_KEY_SECRET);
    const decodedSignatureKey = bytesSignatureKey.toString(crytojs.enc.Utf8);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, decodedSignatureKey);

    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const cert = certBags[forge.oids.certBag][1].cert;
    const pkcs8bags = p12.getBags({
      bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
    });
    const pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][1];
    let key = pkcs8.key;

    if (key == null) {
      key = pkcs8.asn1;
    }

    const commonName = cert.issuer.getField("CN");
    const localityName = cert.issuer.getField("L");
    const organizationalUnitName = cert.issuer.getField("OU");
    const organizationName = cert.issuer.getField("O");
    const countryName = cert.issuer.getField("C");

    IssuerName +=
      "CN=" +
      commonName.value +
      ",L=" +
      localityName.value +
      ",OU=" +
      organizationalUnitName.value +
      ",O=" +
      organizationName.value +
      ",C=" +
      countryName.value;

    certificateX509_pem = forge.pki.certificateToPem(cert);
    certificateX509 = certificateX509_pem;
    certificateX509 = certificateX509.substr(certificateX509.indexOf("\n"));
    certificateX509 = certificateX509.substr(
      0,
      certificateX509.indexOf("\n-----END CERTIFICATE-----")
    );

    certificateX509 = certificateX509
      .replace(/\r?\n|\r/g, "")
      .replace(/([^\0]{76})/g, "$1\n");

    //Pasar certificado a formato DER y sacar su hash:
    certificateX509_asn1 = forge.pki.certificateToAsn1(cert);
    certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
    certificateX509_der_hash = sha1_base64WithOutUtf8(certificateX509_der);

    //Serial Number
    const X509SerialNumber = parseInt(cert.serialNumber, 16);

    exponent = hexToBase64(key.e.data[0].toString(16));
    modulus = bigint2base64(key.n);

    const sha1_comprobante = sha1_base64(
      comprobante.replace('<?xml version="1.0" encoding="UTF-8"?>\n', "")
    );

    const xmlns =
      'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';
    const Certificate_number = p_obtener_aleatorio();
    const Signature_number = p_obtener_aleatorio();
    const SignedProperties_number = p_obtener_aleatorio();
    const SignedInfo_number = p_obtener_aleatorio();
    const SignedPropertiesID_number = p_obtener_aleatorio();
    const Reference_ID_number = p_obtener_aleatorio();
    const SignatureValue_number = p_obtener_aleatorio();
    const Object_number = p_obtener_aleatorio();

    let SignedProperties = "";

    SignedProperties +=
      '<etsi:SignedProperties Id="Signature' +
      Signature_number +
      "-SignedProperties" +
      SignedProperties_number +
      '">'; //SignedProperties
    SignedProperties += "<etsi:SignedSignatureProperties>";
    SignedProperties += "<etsi:SigningTime>";

    //SignedProperties += '2016-12-24T13:46:43-05:00';//moment().format('YYYY-MM-DD\THH:mm:ssZ');
    SignedProperties += new Date().toISOString();

    SignedProperties += "</etsi:SigningTime>";
    SignedProperties += "<etsi:SigningCertificate>";
    SignedProperties += "<etsi:Cert>";
    SignedProperties += "<etsi:CertDigest>";
    SignedProperties += `<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">`;
    SignedProperties += "</ds:DigestMethod>";
    SignedProperties += "<ds:DigestValue>";

    SignedProperties += certificateX509_der_hash;

    SignedProperties += "</ds:DigestValue>";
    SignedProperties += "</etsi:CertDigest>";
    SignedProperties += "<etsi:IssuerSerial>";
    SignedProperties += "<ds:X509IssuerName>";
    SignedProperties += IssuerName;
    SignedProperties += "</ds:X509IssuerName>";
    SignedProperties += "<ds:X509SerialNumber>";

    SignedProperties += X509SerialNumber;

    SignedProperties += "</ds:X509SerialNumber>";
    SignedProperties += "</etsi:IssuerSerial>";
    SignedProperties += "</etsi:Cert>";
    SignedProperties += "</etsi:SigningCertificate>";
    SignedProperties += "</etsi:SignedSignatureProperties>";
    SignedProperties += "<etsi:SignedDataObjectProperties>";
    SignedProperties +=
      '<etsi:DataObjectFormat ObjectReference="#Reference-ID-' +
      Reference_ID_number +
      '">';
    SignedProperties += "<etsi:Description>";

    SignedProperties += "contenido comprobante";

    SignedProperties += "</etsi:Description>";
    SignedProperties += "<etsi:MimeType>";
    SignedProperties += "text/xml";
    SignedProperties += "</etsi:MimeType>";
    SignedProperties += "</etsi:DataObjectFormat>";
    SignedProperties += "</etsi:SignedDataObjectProperties>";
    SignedProperties += "</etsi:SignedProperties>"; //fin SignedProperties

    SignedProperties_para_hash = SignedProperties.replace(
      "<etsi:SignedProperties",
      "<etsi:SignedProperties " + xmlns
    );

    const sha1_SignedProperties = sha1_base64(SignedProperties_para_hash);
    let KeyInfo = "";

    KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
    KeyInfo += "\n<ds:X509Data>";
    KeyInfo += "\n<ds:X509Certificate>\n";

    //CERTIFICADO X509 CODIFICADO EN Base64
    KeyInfo += certificateX509;

    KeyInfo += "\n</ds:X509Certificate>";
    KeyInfo += "\n</ds:X509Data>";
    KeyInfo += "\n<ds:KeyValue>";
    KeyInfo += "\n<ds:RSAKeyValue>";
    KeyInfo += "\n<ds:Modulus>\n";

    //MODULO DEL CERTIFICADO X509
    KeyInfo += modulus;

    KeyInfo += "\n</ds:Modulus>";
    KeyInfo += "\n<ds:Exponent>";

    //KeyInfo += 'AQAB';
    KeyInfo += exponent;

    KeyInfo += "</ds:Exponent>";
    KeyInfo += "\n</ds:RSAKeyValue>";
    KeyInfo += "\n</ds:KeyValue>";
    KeyInfo += "\n</ds:KeyInfo>";

    KeyInfo_para_hash = KeyInfo.replace("<ds:KeyInfo", "<ds:KeyInfo " + xmlns);

    const sha1_certificado = sha1_base64(KeyInfo_para_hash);

    let SignedInfo = "";

    SignedInfo +=
      '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
    SignedInfo +=
      '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
    SignedInfo += "</ds:CanonicalizationMethod>";
    SignedInfo +=
      '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
    SignedInfo += "</ds:SignatureMethod>";
    SignedInfo +=
      '\n<ds:Reference Id="SignedPropertiesID' +
      SignedPropertiesID_number +
      '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' +
      Signature_number +
      "-SignedProperties" +
      SignedProperties_number +
      '">';
    SignedInfo +=
      '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += "</ds:DigestMethod>";
    SignedInfo += "\n<ds:DigestValue>";

    //HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
    SignedInfo += sha1_SignedProperties;

    SignedInfo += "</ds:DigestValue>";
    SignedInfo += "\n</ds:Reference>";
    SignedInfo +=
      '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
    SignedInfo +=
      '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += "</ds:DigestMethod>";
    SignedInfo += "\n<ds:DigestValue>";

    //HASH O DIGEST DEL CERTIFICADO X509
    SignedInfo += sha1_certificado;

    SignedInfo += "</ds:DigestValue>";
    SignedInfo += "\n</ds:Reference>";
    SignedInfo +=
      '\n<ds:Reference Id="Reference-ID-' +
      Reference_ID_number +
      '" URI="#comprobante">';
    SignedInfo += "\n<ds:Transforms>";
    SignedInfo +=
      '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
    SignedInfo += "</ds:Transform>";
    SignedInfo += "\n</ds:Transforms>";
    SignedInfo +=
      '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
    SignedInfo += "</ds:DigestMethod>";
    SignedInfo += "\n<ds:DigestValue>";

    //HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante"
    SignedInfo += sha1_comprobante;

    SignedInfo += "</ds:DigestValue>";
    SignedInfo += "\n</ds:Reference>";
    SignedInfo += "\n</ds:SignedInfo>";

    SignedInfo_para_firma = SignedInfo.replace(
      "<ds:SignedInfo",
      "<ds:SignedInfo " + xmlns
    );

    let md = forge.md.sha1.create();
    md.update(SignedInfo_para_firma, "utf8");

    const signature = btoa(key.sign(md))
      .match(/.{1,76}/g)
      .join("\n");

    let xades_bes = "";

    //INICIO DE LA FIRMA DIGITAL
    xades_bes +=
      "<ds:Signature " + xmlns + ' Id="Signature' + Signature_number + '">';
    xades_bes += "\n" + SignedInfo;

    xades_bes +=
      '\n<ds:SignatureValue Id="SignatureValue' +
      SignatureValue_number +
      '">\n';

    //VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL)
    xades_bes += signature;

    xades_bes += "\n</ds:SignatureValue>";

    xades_bes += "\n" + KeyInfo;

    xades_bes +=
      '\n<ds:Object Id="Signature' +
      Signature_number +
      "-Object" +
      Object_number +
      '">';
    xades_bes +=
      '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';

    //ELEMENTO <etsi:SignedProperties>';
    xades_bes += SignedProperties;

    xades_bes += "</etsi:QualifyingProperties>";
    xades_bes += "</ds:Object>";
    xades_bes += "</ds:Signature>";

    //FIN DE LA FIRMA DIGITAL
    const result = comprobante.replace(/(<[^<]+)$/, xades_bes + "$1");
    fs.writeFileSync(`src/server/services/generated/${keyAccess}.xml`, result);
    // return keyAccess;
  }
}

function sha1_base64WithOutUtf8(txt) {
  let md = forge.md.sha1.create();
  md.update(txt);
  //return new Buffer(md.digest().toHex(), 'hex').toString('base64');
  return new Buffer.from(md.digest().toHex(), "hex").toString("base64");
}

function sha1_base64(txt) {
  let md = forge.md.sha1.create();
  md.update(txt, "utf8");
  //return new Buffer(md.digest().toHex(), 'hex').toString('base64');
  return new Buffer.from(md.digest().toHex(), "hex").toString("base64");
}

function hexToBase64(str) {
  var hex = ("00" + str).slice(0 - str.length - (str.length % 2));

  return btoa(
    String.fromCharCode.apply(
      null,
      hex
        .replace(/\r|\n/g, "")
        .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
        .replace(/ +$/, "")
        .split(" ")
    )
  );
}

function bigint2base64(bigint) {
  var base64 = "";
  base64 = btoa(
    bigint
      .toString(16)
      .match(/\w{2}/g)
      .map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
      })
      .join("")
  );
  base64 = base64.match(/.{1,76}/g).join("\n");
  return base64;
}

function p_obtener_aleatorio() {
  return Math.floor(Math.random() * 999000) + 990;
}
