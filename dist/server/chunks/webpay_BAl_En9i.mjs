import { createClient } from '@supabase/supabase-js';
import * as TransbankPkg from 'transbank-sdk';

const supabaseUrl = "https://hmpeohszbimivcyguwte.supabase.co";
const supabaseKey = "sb_publishable_N-kiGR-t8iSXERVt7trodw_Fy-x-v6V";
const supabase = createClient(supabaseUrl, supabaseKey);

const Transbank = TransbankPkg.default || TransbankPkg;
const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = Transbank;
const initTransaction = async (amount, buyOrder, sessionId, returnUrl) => {
  const commerceCode = IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = IntegrationApiKeys.WEBPAY;
  const environment = Environment.Production ;
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
const confirmTransaction = async (token) => {
  const commerceCode = IntegrationCommerceCodes.WEBPAY_PLUS;
  const apiKey = IntegrationApiKeys.WEBPAY;
  const environment = Environment.Production ;
  const tx = new WebpayPlus.Transaction(new Options(
    commerceCode,
    apiKey,
    environment
  ));
  return await tx.commit(token);
};

export { confirmTransaction as c, initTransaction as i, supabase as s };
