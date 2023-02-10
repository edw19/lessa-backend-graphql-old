interface IGenerateKeyAccessProps {
  ruc: string | undefined;
  voucher: string;
  environment: string;
  serie: string;
  sequential: string;
}

export class KeyAccess {
  static generateKeyAccess({
    ruc,
    voucher,
    environment,
    serie,
    sequential,
  }: IGenerateKeyAccessProps): string {
    let key = "";
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    key += day > 9 ? day : "0" + day;
    key += month > 9 ? month : "0" + month;
    key += date.getFullYear();
    key += voucher;
    key += ruc;
    key += environment;
    key += serie;
    key += sequential;
    key += KeyAccess.ramdomNumericCode();
    key += "1";
    key += KeyAccess.generateCheckDigit(key);
    return key;
  }

  static generateCheckDigit(keyAccess: string) {
    let sum = 0;
    let ponderado = 2;
    for (let index = 47; index > -1; index--) {
      if (ponderado > 7) {
        ponderado = 2;
      }
      sum += parseInt(keyAccess[index]) * ponderado;
      ponderado++;
    }
    const result = 11 - (sum % 11);
    if (result === 11) {
      return 0;
    }
    if (result === 10) {
      return 1;
    }
    return result;
  }

  static ramdomNumericCode() {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    if (random.toString().length < 8) {
      console.log("el ramdom fallo");
    }
    return random;
  }
}
