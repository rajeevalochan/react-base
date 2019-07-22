import Authorization from "./Authorization";
import Utility from "./Utility";
import Env from "./env";

class RequestFactory {
  /**
   * static class property to hold various service avaliable
   *
   * @var array
   */

  static LOCALHOST = "localhost";
  /**
   * static class property to hold various request body types avaliable
   *
   * @var string
   */
  static REQUEST_BODY_TYPE_FORM_DATA = "FormData";
  static REQUEST_BODY_TYPE_RAW = "Raw";
  static REQUEST_BODY_TYPE_JSON = "Json";
  static REQUEST_BODY_TYPE_IMAGE = "Image";
  /**
   * static class property to hold the request body type available
   *
   * @var array
   */
  static requestBodyTypes = ["FormData", "Raw", "Json", "Image"];
  /**
   * static class property to hold the available for the application
   *
   * @var object
   */
  static services = {
    BASE_API: "REACT_APP_BACKEND_BASE_URL"
  };
  /**
   * static class property to hold the unallowed request params
   *
   * @var array
   */
  static unallowedRequestParamKeys = ["inputErrors"];

  constructor() {
    Env.fetchEnv();

    // RequestFactory.services["BASE_API"] = window.env.REACT_APP_API_LOCALHOST;
    this.resetFactory();
  }
  /**
   * set this service current request made with
   *
   * @param service
   * @return this
   */
  withService(service) {
    this.service = service;

    return this;
  }
  /**
   * check request is failed due to network connection
   *
   * @param responseMessage
   * @return boolean
   */
  isFetchFailure(responseMessage) {
    return (
      responseMessage === "Failed to fetch" ||
      responseMessage === "NetworkError when attempting to fetch resource." ||
      responseMessage === "Network request failed"
    );
  }
  /**
   * set headers for current request
   *
   * @param key
   * @param value
   * @return this
   */
  setHeaders(key, value) {
    this.headers.set(key, value);

    return this;
  }
  /**
   * remove headers from existing for current request
   *
   * @param key
   * @return this
   */
  removeHeaders(key) {
    if (this.headers.has(key)) {
      this.headers.delete(key);
    }

    return this;
  }
  /**
   * set this service current request made with
   *
   * @param service
   * @return this
   */
  withRequestBodyType(requestBodyType) {
    this.requestBodyType = requestBodyType;

    return this;
  }
  /**
   * reset this property default for request
   *
   * @return void
   */
  resetFactory(service) {
    this.headers = new Headers({
      Accept: "application/json",
      Pragma: "no-cache",
      "Cache-Control": "no-cache, no-store",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    });

    this.service = RequestFactory.DEVICES;

    this.requestBodyType = RequestFactory.REQUEST_BODY_TYPE_FORM_DATA;
  }
  /**
   * check key is allowed for request param
   *
   * @param key
   * @return boolean
   */
  isAllowedRequestParamKey(key) {
    return RequestFactory.unallowedRequestParamKeys.indexOf(key) === -1;
  }
  /**
   * get available headers
   *
   * @return headers
   */
  getHeaders() {
    let accessToken = Authorization.getAccessToken();

    if (accessToken) {
      this.headers.set("Authorization", `${accessToken}`);
    }

    return this.headers;
  }
  /**
   * get base api url
   *
   * @return string
   */
  getBaseApiUrl() {
    return Env.getEnv(RequestFactory.services["BASE_API"]);
  }
  /**
   * convert the object to raw data(string) by
   * Serialize the object with url encode
   * used when form data is not prepared for request body
   *
   * @param object
   * @return object
   */
  convertObjectToRawData(obj) {
    return JSON.stringify(obj);
  }
  /**
   * filter the request paran
   * remove the unallowed request params
   *
   * @param object
   * @return object
   */
  filterRequestParam(data) {
    if (typeof data === "object" && Object.keys(data).length > 0) {
      RequestFactory.unallowedRequestParamKeys.forEach(key => {
        if (data.hasOwnProperty(key)) {
          delete data[key];
        }
      });
    }

    return data;
  }
  /**
   * get base api url
   *
   * @param object
   * @return object
   */
  getRequestBody(data) {
    var body;

    data = this.filterRequestParam(data);
    switch (this.requestBodyType) {
      case RequestFactory.REQUEST_BODY_TYPE_RAW:
        body = this.convertObjectToRawData(data);
        break;
      case RequestFactory.REQUEST_BODY_TYPE_JSON:
        body = JSON.stringify(data);
        break;
      case RequestFactory.REQUEST_BODY_TYPE_IMAGE:
        body = data;
        break;
      default:
        body = new FormData();
        Object.keys(data).forEach(key => {
          body.append(key, data[key]);

          debugger;
        });
        break;
    }
    return body;
  }
  /**
   * get request
   * @param url
   * @param successCallback
   * @param errorCallback
   * @param queryParams
   * @return void
   */
  get(url, successCallback, errorCallback, queryParams) {
    let headers = this.getHeaders();
    return this.request(
      this.getUrl(url, queryParams),
      {
        method: "GET",
        headers: headers,
        mode: "cors"
      },
      successCallback,
      errorCallback
    );
  }
  /**
   * post request
   * @param url
   * @param data
   * @param successCallback
   * @param errorCallback
   * @param queryParams
   * @return void
   */
  post(url, data, successCallback, errorCallback, queryParams) {
    this.request(
      this.getUrl(url, queryParams),
      {
        method: "POST",
        headers: this.getHeaders(),
        body: this.getRequestBody(data)
      },
      successCallback,
      errorCallback
    );
  }
  /**
   * put request
   * @param url
   * @param data
   * @param successCallback
   * @param errorCallback
   * @param queryParams
   * @return void
   */
  put(url, data, successCallback, errorCallback, queryParams) {
    this.request(
      this.getUrl(url, queryParams),
      {
        method: "PUT",
        headers: this.getHeaders(),
        body: this.getRequestBody(data)
      },
      successCallback,
      errorCallback
    );
  }
  /**
   * delete request
   * @param url
   * @param data
   * @param successCallback
   * @param errorCallback
   * @param queryParams
   * @return void
   */
  delete(url, data, successCallback, errorCallback, queryParams) {
    this.request(
      this.getUrl(url, queryParams),
      {
        method: "DELETE",
        headers: this.getHeaders(),
        body: this.getRequestBody(data)
      },
      successCallback,
      errorCallback
    );
  }
  /**
   * request
   *
   * @param url
   * @param config
   * @param successCallback
   * @param errorCallback
   * @return void
   */
  request(url, config, successCallback, errorCallback) {
    this.resetFactory();
    return fetch(url, config)
      .then(this.responseParser())
      .then(this.successCallback(successCallback, errorCallback))
      .catch(this.errorCallback(errorCallback));
  }

  /**
   * response parser
   *
   * @return string
   */
  responseParser() {
    return response => {
      if (response.status >= 400 && response.status < 600) {
        return response.json().then(err => {
          throw err;
        });
      }
      // check for header and send the content
      if (
        response.headers.get("content-type").indexOf("application/json") !== -1
      ) {
        // checking response header
        return response.json();
      } else {
        return response.blob();
      }
    };
  }
  /**
   * callback the sucess method
   * @param callback
   * @param errorCallback
   * @return string
   */
  successCallback(callback, errorCallback) {
    return json => {
      if (Utility.isObject(json) && json.hasOwnProperty("is_token_invalid")) {
        errorCallback(json);
      } else if (typeof callback === "function") {
        callback(json);
      }
    };
  }
  /**
   * callback the error method
   *
   * @param callback
   * @return string
   */
  errorCallback(callback) {
    // check whether received status is unauthorized
    return response => {
      if (
        (response.errors &&
          response.errors.message === "Authentication failed") ||
        (response instanceof TypeError && this.isFetchFailure(response.message))
      ) {
        Authorization.logout();
      }

      if (typeof callback === "function") {
        callback(response);
      }
    };
  }
  /**
   * build the query
   *
   * @param queryParams
   * @return string
   */
  buildQueryParams(queryParams) {
    var params = false;
    var queryLength = Object.keys(queryParams).length;
    var i = 1;

    for (var iter in queryParams) {
      if (typeof queryParams[iter] !== "undefined") {
        if (!params) {
          params = "?";
        }
        if (typeof queryParams[iter] === "object") {
          for (var queryParamIter in queryParams[iter]) {
            params +=
              iter +
              "[" +
              queryParamIter +
              "]=" +
              queryParams[iter][queryParamIter];
            params += "&";
          }
        } else {
          params += iter + "=" + queryParams[iter];
        }

        if (i < queryLength) {
          params += "&";
        }

        i++;
      }
    }

    return params;
  }
  /**
   * get the url
   *
   * @param path
   * @param queryParams
   * @return string
   */
  getUrl(path, queryParams) {
    console.log(`######`, this.getBaseApiUrl());
    var url = this.getBaseApiUrl() + "/" + path;
    return queryParams ? url + this.buildQueryParams(queryParams) : url;
  }

  /**
   * call request
   * @param url
   * @param data
   * @param successCallback
   * @param errorCallback
   * @param queryParams
   * @return void
   */

  call(type, url, data, successCallback, errorCallback, queryParams, cache) {
    if (type === "GET") {
      let headers = this.getHeaders();
      this.request(
        this.getUrl(url, queryParams),
        {
          method: "GET",
          headers: headers,
          mode: "cors"
        },
        successCallback,
        errorCallback
      );
    } else {
      if (this.requestBodyType !== RequestFactory.REQUEST_BODY_TYPE_IMAGE) {
        this.headers.set("Content-Type", "application/json;charset=UTF-8");
      } else {
        this.removeHeaders("Content-Type");
      }
      this.request(
        this.getUrl(url, queryParams),
        {
          method: type,
          headers: this.getHeaders(),
          body: this.getRequestBody(data)
        },
        successCallback,
        errorCallback
      );
    }
  }
}

export default new RequestFactory();
