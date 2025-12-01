export const DUITKU = {
  merchantCode: process.env.DUITKU_MERCHANT_CODE,
  apiKey: process.env.DUITKU_API_KEY,
  sandbox: process.env.NODE_ENV !== "production",
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://passport.duitku.com/webapi/api/"
      : "https://sandbox.duitku.com/webapi/api/",
};
