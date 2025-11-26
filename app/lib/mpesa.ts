/**
 * M-Pesa Integration Utility
 * This file contains helper functions for M-Pesa STK Push integration
 * 
 * To integrate with real M-Pesa:
 * 1. Get API credentials from Safaricom Developer Portal
 * 2. Add credentials to .env file
 * 3. Implement the actual API calls below
 */

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  environment: 'sandbox' | 'production';
  baseUrl?: string;
}

interface StkPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDescription: string;
}

interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

/**
 * Get M-Pesa configuration from environment variables
 */
export function getMpesaConfig(): MpesaConfig {
  return {
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    shortcode: process.env.MPESA_SHORTCODE || '',
    passkey: process.env.MPESA_PASSKEY || '',
    environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    baseUrl: process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke',
  };
}

/**
 * Generate M-Pesa access token
 * Required for all M-Pesa API calls
 */
export async function getMpesaAccessToken(): Promise<string> {
  const config = getMpesaConfig();
  
  if (!config.consumerKey || !config.consumerSecret) {
    throw new Error('M-Pesa credentials not configured');
  }
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
  const baseUrl = config.baseUrl || 'https://sandbox.safaricom.co.ke';
  const url = `${baseUrl.replace(/\/$/, '')}/oauth/v1/generate?grant_type=client_credentials`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error('Error getting M-Pesa access token:', response.status, data);
      throw new Error(`Failed to get access token: ${response.status} ${JSON.stringify(data)}`);
    }

    if (!data.access_token) {
      throw new Error('M-Pesa access token missing in response');
    }

    return data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw error;
  }
}

/**
 * Initiate M-Pesa STK Push
 */
export async function initiateStkPush(request: StkPushRequest): Promise<StkPushResponse> {
  const config = getMpesaConfig();

  if (!config.passkey) {
    throw new Error('M-Pesa Passkey not configured');
  }

  try {
    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    // Generate password: base64(shortcode + passkey + timestamp)
    const password = Buffer.from(
      `${config.shortcode}${config.passkey}${timestamp}`
    ).toString('base64');

    const baseUrl = config.baseUrl || 'https://sandbox.safaricom.co.ke';
    const url = `${baseUrl.replace(/\/$/, '')}/mpesa/stkpush/v1/processrequest`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: request.amount,
        PartyA: request.phoneNumber,
        PartyB: config.shortcode,
        PhoneNumber: request.phoneNumber,
        CallBackURL: process.env.NEXT_PUBLIC_APP_URL,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDescription,
      }),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error('STK Push failed:', response.status, data);
      throw new Error(data.ResponseDescription || data.errorMessage || `M-Pesa API error (${response.status})`);
    }

    return data as StkPushResponse;
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    throw error;
  }
}

/**
 * Query STK Push status
 */
export async function queryStkPushStatus(
  checkoutRequestId: string
): Promise<Record<string, unknown>> {
  const config = getMpesaConfig();

  if (!config.passkey) {
    throw new Error('M-Pesa Passkey not configured');
  }

  try {
    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    const password = Buffer.from(
      `${config.shortcode}${config.passkey}${timestamp}`
    ).toString('base64');

    const baseUrl = config.baseUrl || 'https://sandbox.safaricom.co.ke';
    const url = `${baseUrl.replace(/\/$/, '')}/mpesa/stkpushquery/v1/query`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { raw: text };
    }
  } catch (error) {
    console.error('Error querying STK Push status:', error);
    throw error;
  }
}
