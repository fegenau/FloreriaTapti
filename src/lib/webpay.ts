// @ts-ignore
import * as TransbankPkg from 'transbank-sdk';
// @ts-ignore
const Transbank = TransbankPkg.default || TransbankPkg;
const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = Transbank;

export const initTransaction = async (
  amount: number, 
  buyOrder: string, 
  sessionId: string, 
  returnUrl: string
) => {
  const commerceCode = import.meta.env.WEBPAY_CC || IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = import.meta.env.WEBPAY_KEY || IntegrationApiKeys.WEBPAY;
  const environment = import.meta.env.PROD 
    ? Environment.Production 
    : Environment.Integration;

  const tx = new WebpayPlus.Transaction(new Options(
    commerceCode,
    apiKey,
    environment
  ));

  return await tx.create(
    buyOrder, 
    sessionId, 
    amount, 
    returnUrl
  );
};

export const confirmTransaction = async (token: string) => {
  const commerceCode = import.meta.env.WEBPAY_CC || IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = import.meta.env.WEBPAY_KEY || IntegrationApiKeys.WEBPAY;
  const environment = import.meta.env.PROD 
    ? Environment.Production 
    : Environment.Integration;

  const tx = new WebpayPlus.Transaction(new Options(
    commerceCode,
    apiKey,
    environment
  ));

  return await tx.commit(token);
};
