import * as forge from 'node-forge'
import fs from 'fs'
import btoa from 'btoa'
import crytojs from 'crypto-js'
import { SIGNATURE_KEY_SECRET } from 'config/variables'

export class SignDocument {
	static signXml(comprobante: any, keyAccess: any, signatureInfo: any) {
		let certificateX509Pem = null
		let certificateX509 = null
		let certificateX509Asn1 = null
		let certificateX509Der = null
		let certificateX509DerHash = null
		let exponent = null
		let modulus = null
		let SignedPropertiesParaHash = null
		let KeyInfoForhash = null
		let SignedInfoForSign = null
		let IssuerName = ''

		const { signatureKey, signaturePath } = signatureInfo
		const sign = fs.readFileSync(signaturePath)
		const arrayUint8 = new Uint8Array(sign)
		const p12B64 = forge.util.binary.base64.encode(arrayUint8)
		const p12Der = forge.util.decode64(p12B64)
		const p12Asn1 = forge.asn1.fromDer(p12Der)

		const bytesSignatureKey = crytojs.AES.decrypt(
			signatureKey,
			SIGNATURE_KEY_SECRET
		)
		const decodedSignatureKey = bytesSignatureKey.toString(crytojs.enc.Utf8)
		const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, decodedSignatureKey)

		const certBags: any = p12.getBags({ bagType: forge.pki.oids.certBag })
		// @ts-ignore
		const cert = certBags[forge.oids.certBag][1].cert
		const pkcs8bags: any = p12.getBags({
			bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
		})
		// @ts-ignore
		const pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][1]
		let key: any = pkcs8.key

		if (key == null) {
			key = pkcs8.asn1
		}
		if (!cert) return
		const commonName = cert.issuer.getField('CN')
		const localityName = cert.issuer.getField('L')
		const organizationalUnitName = cert.issuer.getField('OU')
		const organizationName = cert.issuer.getField('O')
		const countryName = cert.issuer.getField('C')

		IssuerName +=
			'CN=' +
			commonName.value +
			',L=' +
			localityName.value +
			',OU=' +
			organizationalUnitName.value +
			',O=' +
			organizationName.value +
			',C=' +
			countryName.value

		certificateX509Pem = forge.pki.certificateToPem(cert)
		certificateX509 = certificateX509Pem
		certificateX509 = certificateX509.substr(certificateX509.indexOf('\n'))
		certificateX509 = certificateX509.substr(
			0,
			certificateX509.indexOf('\n-----END CERTIFICATE-----')
		)

		certificateX509 = certificateX509
			.replace(/\r?\n|\r/g, '')
			.replace(/([^\0]{76})/g, '$1\n')

		// Pasar certificado a formato DER y sacar su hash:
		certificateX509Asn1 = forge.pki.certificateToAsn1(cert)
		certificateX509Der = forge.asn1.toDer(certificateX509Asn1).getBytes()
		certificateX509DerHash = sha1Base64WithOutUtf8(certificateX509Der)

		// Serial Number
		const X509SerialNumber = parseInt(cert.serialNumber, 16)

		exponent = hexToBase64(key.e.data[0].toString(16))
		modulus = bigint2base64(key.n)

		const sha1Comprobante = sha1Base64(
			comprobante.replace('<?xml version="1.0" encoding="UTF-8"?>\n', '')
		)

		const xmlns =
			'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"'
		const certificateNumber = getNumberRandom()
		const signatureNumber = getNumberRandom()
		const SignedPropertiesNumber = getNumberRandom()
		const SignedInfoNumber = getNumberRandom()
		const SignedPropertiesIDNumber = getNumberRandom()
		const ReferenceIDNumber = getNumberRandom()
		const SignatureValueNumber = getNumberRandom()
		const ObjectNumber = getNumberRandom()

		let SignedProperties = ''

		SignedProperties +=
			'<etsi:SignedProperties Id="Signature' +
			signatureNumber +
			'-SignedProperties' +
			SignedPropertiesNumber +
			'">' // SignedProperties
		SignedProperties += '<etsi:SignedSignatureProperties>'
		SignedProperties += '<etsi:SigningTime>'

		// SignedProperties += '2016-12-24T13:46:43-05:00';//moment().format('YYYY-MM-DD\THH:mm:ssZ');
		SignedProperties += new Date().toISOString()

		SignedProperties += '</etsi:SigningTime>'
		SignedProperties += '<etsi:SigningCertificate>'
		SignedProperties += '<etsi:Cert>'
		SignedProperties += '<etsi:CertDigest>'
		SignedProperties += `<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">`
		SignedProperties += '</ds:DigestMethod>'
		SignedProperties += '<ds:DigestValue>'

		SignedProperties += certificateX509DerHash

		SignedProperties += '</ds:DigestValue>'
		SignedProperties += '</etsi:CertDigest>'
		SignedProperties += '<etsi:IssuerSerial>'
		SignedProperties += '<ds:X509IssuerName>'
		SignedProperties += IssuerName
		SignedProperties += '</ds:X509IssuerName>'
		SignedProperties += '<ds:X509SerialNumber>'

		SignedProperties += X509SerialNumber

		SignedProperties += '</ds:X509SerialNumber>'
		SignedProperties += '</etsi:IssuerSerial>'
		SignedProperties += '</etsi:Cert>'
		SignedProperties += '</etsi:SigningCertificate>'
		SignedProperties += '</etsi:SignedSignatureProperties>'
		SignedProperties += '<etsi:SignedDataObjectProperties>'
		SignedProperties +=
			'<etsi:DataObjectFormat ObjectReference="#Reference-ID-' +
			ReferenceIDNumber +
			'">'
		SignedProperties += '<etsi:Description>'

		SignedProperties += 'contenido comprobante'

		SignedProperties += '</etsi:Description>'
		SignedProperties += '<etsi:MimeType>'
		SignedProperties += 'text/xml'
		SignedProperties += '</etsi:MimeType>'
		SignedProperties += '</etsi:DataObjectFormat>'
		SignedProperties += '</etsi:SignedDataObjectProperties>'
		SignedProperties += '</etsi:SignedProperties>' // fin SignedProperties

		SignedPropertiesParaHash = SignedProperties.replace(
			'<etsi:SignedProperties',
			'<etsi:SignedProperties ' + xmlns
		)

		const sha1SignedProperties = sha1Base64(SignedPropertiesParaHash)
		let KeyInfo = ''

		KeyInfo += '<ds:KeyInfo Id="Certificate' + certificateNumber + '">'
		KeyInfo += '\n<ds:X509Data>'
		KeyInfo += '\n<ds:X509Certificate>\n'

		// CERTIFICADO X509 CODIFICADO EN Base64
		KeyInfo += certificateX509

		KeyInfo += '\n</ds:X509Certificate>'
		KeyInfo += '\n</ds:X509Data>'
		KeyInfo += '\n<ds:KeyValue>'
		KeyInfo += '\n<ds:RSAKeyValue>'
		KeyInfo += '\n<ds:Modulus>\n'

		// MODULO DEL CERTIFICADO X509
		KeyInfo += modulus

		KeyInfo += '\n</ds:Modulus>'
		KeyInfo += '\n<ds:Exponent>'

		// KeyInfo += 'AQAB';
		KeyInfo += exponent

		KeyInfo += '</ds:Exponent>'
		KeyInfo += '\n</ds:RSAKeyValue>'
		KeyInfo += '\n</ds:KeyValue>'
		KeyInfo += '\n</ds:KeyInfo>'

		KeyInfoForhash = KeyInfo.replace('<ds:KeyInfo', '<ds:KeyInfo ' + xmlns)

		const sha1Certificate = sha1Base64(KeyInfoForhash)

		let SignedInfo = ''

		SignedInfo +=
			'<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfoNumber + '">'
		SignedInfo +=
			'\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">'
		SignedInfo += '</ds:CanonicalizationMethod>'
		SignedInfo +=
			'\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">'
		SignedInfo += '</ds:SignatureMethod>'
		SignedInfo +=
			'\n<ds:Reference Id="SignedPropertiesID' +
			SignedPropertiesIDNumber +
			'" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' +
			signatureNumber +
			'-SignedProperties' +
			SignedPropertiesNumber +
			'">'
		SignedInfo +=
			'\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">'
		SignedInfo += '</ds:DigestMethod>'
		SignedInfo += '\n<ds:DigestValue>'

		// HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
		SignedInfo += sha1SignedProperties

		SignedInfo += '</ds:DigestValue>'
		SignedInfo += '\n</ds:Reference>'
		SignedInfo += '\n<ds:Reference URI="#Certificate' + certificateNumber + '">'
		SignedInfo +=
			'\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">'
		SignedInfo += '</ds:DigestMethod>'
		SignedInfo += '\n<ds:DigestValue>'

		// HASH O DIGEST DEL CERTIFICADO X509
		SignedInfo += sha1Certificate

		SignedInfo += '</ds:DigestValue>'
		SignedInfo += '\n</ds:Reference>'
		SignedInfo +=
			'\n<ds:Reference Id="Reference-ID-' +
			ReferenceIDNumber +
			'" URI="#comprobante">'
		SignedInfo += '\n<ds:Transforms>'
		SignedInfo +=
			'\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">'
		SignedInfo += '</ds:Transform>'
		SignedInfo += '\n</ds:Transforms>'
		SignedInfo +=
			'\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">'
		SignedInfo += '</ds:DigestMethod>'
		SignedInfo += '\n<ds:DigestValue>'

		// HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante"
		SignedInfo += sha1Comprobante

		SignedInfo += '</ds:DigestValue>'
		SignedInfo += '\n</ds:Reference>'
		SignedInfo += '\n</ds:SignedInfo>'

		SignedInfoForSign = SignedInfo.replace(
			'<ds:SignedInfo',
			'<ds:SignedInfo ' + xmlns
		)

		const md = forge.md.sha1.create()
		md.update(SignedInfoForSign, 'utf8')

		// @ts-ignore
		const signature = btoa(key.sign(md))
			.match(/.{1,76}/g)
			.join('\n')

		let xadesBes = ''

		// INICIO DE LA FIRMA DIGITAL
		xadesBes +=
			'<ds:Signature ' + xmlns + ' Id="Signature' + signatureNumber + '">'
		xadesBes += '\n' + SignedInfo

		xadesBes +=
			'\n<ds:SignatureValue Id="SignatureValue' + SignatureValueNumber + '">\n'

		// VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL)
		xadesBes += signature

		xadesBes += '\n</ds:SignatureValue>'

		xadesBes += '\n' + KeyInfo

		xadesBes +=
			'\n<ds:Object Id="Signature' +
			signatureNumber +
			'-Object' +
			ObjectNumber +
			'">'
		xadesBes +=
			'<etsi:QualifyingProperties Target="#Signature' + signatureNumber + '">'

		// ELEMENTO <etsi:SignedProperties>';
		xadesBes += SignedProperties

		xadesBes += '</etsi:QualifyingProperties>'
		xadesBes += '</ds:Object>'
		xadesBes += '</ds:Signature>'

		// FIN DE LA FIRMA DIGITAL
		const result = comprobante.replace(/(<[^<]+)$/, xadesBes + '$1')
		fs.writeFileSync(`src/server/services/generated/${keyAccess}.xml`, result)
		// return keyAccess;
	}
}

function sha1Base64WithOutUtf8(txt: any) {
	const md = forge.md.sha1.create()
	md.update(txt)
	/* eslint-disable new-cap */
	// @ts-ignore
	return new Buffer.from(md.digest().toHex(), 'hex').toString('base64')
}

function sha1Base64(txt: any) {
	const md = forge.md.sha1.create()
	md.update(txt, 'utf8')
	/* eslint-disable new-cap */
	// @ts-ignore
	return new Buffer.from(md.digest().toHex(), 'hex').toString('base64')
}

function hexToBase64(str: any) {
	const hex = ('00' + str).slice(0 - str.length - (str.length % 2))

	// @ts-ignore
	return btoa(String.fromCharCode.apply(null, hex.replace(/\r|\n/g, '')
		.replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
		.replace(/ +$/, '')
		.split(' ')
	)
	)
}

function bigint2base64(bigint: any) {
	let base64 = ''
	base64 = btoa(
		bigint
			.toString(16)
			.match(/\w{2}/g)
			.map(function (a: any) {
				return String.fromCharCode(parseInt(a, 16))
			})
			.join('')
	)
	// @ts-ignore
	base64 = base64.match(/.{1,76}/g).join('\n')
	return base64
}

function getNumberRandom() {
	return Math.floor(Math.random() * 999000) + 990
}
