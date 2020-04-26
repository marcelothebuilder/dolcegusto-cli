const cheerio = require("cheerio");
const qs = require("querystring");
const { CookieJar } = require("tough-cookie");
const { Spinner } = require("clui");
const axios = require("axios").default;
const axiosCookieJarSupport = require("axios-cookiejar-support").default;

class DolceGustoApiError extends Error {
  static Step = {
    LOGIN: 1,
    SUBMIT_COUPON: 2,
  };

  constructor({ step, message, messages }) {
    super(message);
    this.messages = messages || messages;
    this.step = step;
  }
}

class DolceGustoApi {
  constructor({ email, password }) {
    const cookieJar = new CookieJar();

    this.axios = axios.create({
      jar: cookieJar,
      baseURL: "https://www.nescafe-dolcegusto.com.br/",
    });

    axiosCookieJarSupport(this.axios);

    this.credentials = {
      email,
      password,
    };
  }

  async postCoupon({ coupon }) {
    await this._loginOnce();

    const couponSpinner = new Spinner(`Submitting coupon ${coupon}`);
    couponSpinner.start();

    return this.axios
      .post(
        "pcm/customer_account_bonus/couponPost/",
        qs.encode({ "coupon_code[]": coupon }),
        {
          withCredentials: true,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
          },
          referrer: "https://www.nescafe-dolcegusto.com.br/mybonus/",
          method: "POST",
          mode: "cors",
        }
      )
      .then(({ data, status }) => {
        if (status < 200 || status >= 400) {
          throw new DolceGustoApiError({
            message: `Coupon submission failed with status ${status}`,
            step: DolceGustoApiError.Step.SUBMIT_COUPON,
          });
        }

        const errors = this._parseErrors(data);

        if (!errors.length) return data;

        throw new DolceGustoApiError({
          message: "Error while submitting coupon",
          messages: [...new Set(errors)],
          step: DolceGustoApiError.Step.SUBMIT_COUPON,
        });
      })
      .finally(() => couponSpinner.stop());
  }

  async _loginOnce() {
    if (!this._existingLoginPromise)
      this._existingLoginPromise = this._login(this.credentials);

    return this._existingLoginPromise;
  }

  async _login({ email, password }) {
    const loginSpinner = new Spinner("Authenticating you, please wait...");

    loginSpinner.start();

    return this.axios.get("/").then(({ status, data }) => {
      const $index = cheerio.load(data);
      const formKey = $index('input[name="form_key"]')[0].attribs.value;
      const formReferer = $index('input[name="referer"]')[0].attribs.value;

      return this._executeLoginPost({formKey, formReferer, email, password});
    }).finally(() => loginSpinner.stop());
  }

  async _executeLoginPost({formKey, formReferer, email, password}) {
    return this.axios.post(
        "customer/account/loginPost/",
        qs.encode({
          form_key: formKey,
          referer: formReferer,
          "login[username]": email,
          "login[password]": password,
          persistent_remember_me: "on",
          "recaptcha-form": "login",
          send: undefined,
        }),
        {
          withCredentials: true, // If true, send cookie stored in jar,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            mode: "cors",
          },
        }
      ).then(({ data, status }) => {
        if (status < 200 || status >= 400) {
          throw new DolceGustoApiError({
            message: `Login failed with status ${status}`,
            step: DolceGustoApiError.Step.LOGIN,
          });
        }

        const errors = this._parseErrors(data);

        if (!errors.length) return data;

        throw new DolceGustoApiError({
          message: `Login failed`,
          messages: [...new Set(errors)],
          step: DolceGustoApiError.Step.LOGIN,
        });
      });
  }

  _parseErrors(responseData) {
    const $ = cheerio.load(responseData);
    const msgs = $(".error-msg span");
    return msgs.map((_index, element) => $(element).text()).toArray();
  }
}

module.exports = { DolceGustoApi, DolceGustoApiError };
