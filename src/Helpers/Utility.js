import lodashCamelCase from "lodash.camelcase";
import _ from "lodash";

class Utility {
  /**
   * Get element from array by property
   *
   * @param array
   * @param mixed
   * @param string
   * @return mixed
   */
  static getElementFromArrayByProperty(elements, value, property = "id") {
    let selectedScriptIndex = false;

    let selectedElement = elements.filter((element, index) => {
      let filtered = false;
      if (element[property] === value) {
        filtered = true;
        selectedScriptIndex = index;
      }

      return filtered;
    });
    return {
      element: selectedElement.shift(),
      index: selectedScriptIndex
    };
  }

  /**
   * Get specific element attributes from array
   *
   * @param array
   * @param mixed
   * @param string
   * @return mixed
   */
  static getSpecificAttributeFromArray(elements, property) {
    return Array.isArray(elements) && Utility.isString(property)
      ? elements.map(element => {
          return Utility.isObject(element) && element.hasOwnProperty(property)
            ? element[property]
            : null;
        })
      : [];
  }

  /**
   * delete element from array by property value
   *
   * @param array
   * @param mixed
   * @param string
   * @return mixed
   */
  static removeElementFromArrayByProperty(elements, value, property = "id") {
    return elements.filter((element, index) => {
      return element[property] && element[property] !== value;
    });
  }

  /**
   * Safly push element to array
   *
   * @param elements
   * @param element
   * @param string
   * @return array
   */
  static safelyPushElementToArray(elements, element, property = "id") {
    let elementInfo = Utility.getElementFromArrayByProperty(
      elements,
      element[property]
    );

    if (!elementInfo.index && Array.isArray(elements)) {
      elements.push(element);
    }

    return elements;
  }

  /**
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects. Note that JavaScript arrays are objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */
  static isObject(value) {
    return value !== null && typeof value === "object";
  }

  /**
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */
  static isString(value) {
    return typeof value === "string";
  }

  /**
   * Determines if a value is a regular expression object.
   *
   * @private
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `RegExp`.
   */
  static isRegExp(value) {
    return toString.call(value) === "[object RegExp]";
  }

  /**
   * @description
   * Determines if a value is a date.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Date`.
   */
  static isDate(value) {
    return toString.call(value) === "[object Date]";
  }

  /**
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  static isFunction(value) {
    return typeof value === "function";
  }

  /**
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */
  static isDefined(value) {
    return typeof value !== "undefined";
  }

  /**
   * @description
   * Check current browser is ie
   *
   * @returns {boolean} True if `value` is defined.
   */
  static isIE() {
    return /*@cc_on!@*/ false || !!document.documentMode;
  }

  /**
   * @description
   * Check current browser is Edge
   *
   * @returns {boolean} True if `value` is defined.
   */
  static isEdge() {
    return !Utility.isIE() && !!window.StyleMedia;
  }

  /**
   * @description
   * Get image as base 64
   *
   * @param image
   * @param ext
   * @returns string
   */
  static getImageAsBase64(image, ext) {
    return `data:image/${ext};base64,${image}`;
  }

  /**
   * @description
   * Get string as camel case
   *
   * @param string
   * @returns string
   */
  static camelCase(str) {
    let convertedStr = lodashCamelCase(str);
    return convertedStr.charAt(0).toUpperCase() + convertedStr.slice(1);
  }
}

export default Utility;

/**
 * function is to get formatted date time
 * @param {*} datetime Unix date time
 */
export const getFormattedDateTime = datetime => {
  // unix to milliseconds
  const milliseconds = parseInt(datetime, 10);
  datetime = new Date(milliseconds);

  return datetime.toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
};

/**
 * function is to get formatted date
 * @param {*} datetime Unix date
 */
export const getFormattedDate = datetime => {
  // unix to milliseconds
  const milliseconds = parseInt(datetime, 10);
  datetime = new Date(milliseconds);

  return datetime.toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  });
};

/**
 * Convert strings to its actual data type
 * @param {*} inputObj input object
 *
 * @return Object
 */
export const ParseStringToItsDatatype = inputObj => {
  var obj = Object.assign({}, inputObj);
  for (let i in obj) {
    switch (true) {
      case String(obj[i]).toLowerCase() == "true":
        obj[i] = true;
        break;
      case String(obj[i]).toLowerCase() == "false":
        obj[i] = false;
        break;
      case String(obj[i]).match(/^[0-9]+$/) != null:
        obj[i] = parseInt(obj[i], 10);
        break;
      case String(obj[i]).match(/^[-+]?[0-9]+\.[0-9]+$/) != null:
        obj[i] = parseFloat(obj[i]);
        break;
      default:
        break;
    }
  }
  return obj;
};

/**
 * Function is to truncate the string based on number of characters
 * @param {*} string
 * @param {*} length
 */
export const TrimString = (string, length) => {
  return _.truncate(string, {
    length, // maximum 30 characters
    separator: /,?\.* +/ // separate by spaces, including preceding commas and periods
  });
};
