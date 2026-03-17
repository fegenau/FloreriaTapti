import { createClient } from '@supabase/supabase-js';
import * as TransbankPkg from 'transbank-sdk';

const supabaseUrl = "https://hmpeohszbimivcyguwte.supabase.co";
const supabaseKey = "sb_publishable_N-kiGR-t8iSXERVt7trodw_Fy-x-v6V";
const supabase = createClient(supabaseUrl, supabaseKey);

const Transbank = TransbankPkg.default || TransbankPkg;
const { WebpayPlus, Oneclick, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = Transbank;
const initTransaction = async (amount, buyOrder, sessionId, returnUrl) => {
  const commerceCode = "597055555532";
  const apiKey = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
  const environment = Environment.Production ;
  const tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, environment));
  return await tx.create(buyOrder, sessionId, amount, returnUrl);
};
const confirmTransaction = async (token) => {
  const commerceCode = "597055555532";
  const apiKey = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
  const environment = Environment.Production ;
  const tx = new WebpayPlus.Transaction(new Options(commerceCode, apiKey, environment));
  return await tx.commit(token);
};
const getOneclickConfig = () => {
  const commerceCode = IntegrationCommerceCodes.ONECLICK_MALL;
  const apiKey = IntegrationApiKeys.WEBPAY;
  const environment = Environment.Production ;
  const childCommerceCode = undefined                                 ;
  return { commerceCode, apiKey, environment, childCommerceCode };
};
const startOneclick = async (username, email, returnUrl) => {
  const { commerceCode, apiKey, environment } = getOneclickConfig();
  const inscription = new Oneclick.MallInscription(new Options(commerceCode, apiKey, environment));
  return await inscription.start(username, email, returnUrl);
};
const finishOneclick = async (token) => {
  const { commerceCode, apiKey, environment } = getOneclickConfig();
  const inscription = new Oneclick.MallInscription(new Options(commerceCode, apiKey, environment));
  return await inscription.finish(token);
};
const authorizeOneclick = async (username, tbkUser, buyOrder, amount) => {
  const { commerceCode, apiKey, environment, childCommerceCode } = getOneclickConfig();
  const transaction = new Oneclick.MallTransaction(new Options(commerceCode, apiKey, environment));
  const childBuyOrder = `CHILD-${buyOrder}`;
  const details = [
    new Oneclick.TransactionDetail(amount, childCommerceCode, childBuyOrder)
  ];
  return await transaction.authorize(username, tbkUser, buyOrder, details);
};

export { startOneclick as a, authorizeOneclick as b, confirmTransaction as c, finishOneclick as f, initTransaction as i, supabase as s };
