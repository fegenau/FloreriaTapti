// @ts-ignore
import * as TransbankPkg from 'transbank-sdk';
// @ts-ignore
const Transbank = TransbankPkg.default || TransbankPkg;
const { WebpayPlus, Oneclick, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = Transbank;

// Webpay Plus (One-time payment for Cart)
export const initTransaction = async (
  amount: number, 
  buyOrder: string, 
  sessionId: string, 
  returnUrl: string
) => {
  const commerceCode = import.meta.env.WEBPAY_CC || IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = import.meta.env.WEBPAY_KEY || IntegrationApiKeys.WEBPAY;
  const environment = import.meta.env.PROD ? Environment.Production : Environment.Integration;

  const tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, environment));
  return await tx.create(buyOrder, sessionId, amount, returnUrl);
};

export const confirmTransaction = async (token: string) => {
  const commerceCode = import.meta.env.WEBPAY_CC || IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = import.meta.env.WEBPAY_KEY || IntegrationApiKeys.WEBPAY;
  const environment = import.meta.env.PROD ? Environment.Production : Environment.Integration;

  const tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, environment));
  return await tx.commit(token);
};

// Oneclick Mall (Recurring payments for Subscriptions)

const getOneclickConfig = () => {
    const commerceCode = import.meta.env.ONECLICK_MALL_CC || IntegrationCommerceCodes.ONECLICK_MALL;
    const apiKey = import.meta.env.ONECLICK_KEY || IntegrationApiKeys.WEBPAY; // Usually same key for integration
    const environment = import.meta.env.PROD ? Environment.Production : Environment.Integration;
    const childCommerceCode = import.meta.env.ONECLICK_CHILD_CC;
    
    return { commerceCode, apiKey, environment, childCommerceCode };
};

export const startOneclick = async (username: string, email: string, returnUrl: string) => {
    const { commerceCode, apiKey, environment } = getOneclickConfig();
    const inscription = new Oneclick.MallInscription(new Options(commerceCode, apiKey, environment));
    return await inscription.start(username, email, returnUrl);
};

export const finishOneclick = async (token: string) => {
    const { commerceCode, apiKey, environment } = getOneclickConfig();
    const inscription = new Oneclick.MallInscription(new Options(commerceCode, apiKey, environment));
    return await inscription.finish(token);
};

export const authorizeOneclick = async (username: string, tbkUser: string, buyOrder: string, amount: number) => {
    const { commerceCode, apiKey, environment, childCommerceCode } = getOneclickConfig();
    const transaction = new Oneclick.MallTransaction(new Options(commerceCode, apiKey, environment));
    const childBuyOrder = `CHILD-${buyOrder}`;
    
    const details = [
        new Oneclick.TransactionDetail(amount, childCommerceCode, childBuyOrder)
    ];
    
    return await transaction.authorize(username, tbkUser, buyOrder, details);
};
