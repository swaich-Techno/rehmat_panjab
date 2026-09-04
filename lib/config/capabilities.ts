export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID ||
      process.env.MSG91_AUTH_KEY ||
      process.env.SMS_PROVIDER_KEY ||
      process.env.SMS_API_KEY,
  );
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function publicCapabilities() {
  const supabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const sms = isSmsConfigured();
  return {
    supabase,
    sms,
    phoneAuth: supabase && sms,
    razorpay: isRazorpayConfigured(),
  };
}
