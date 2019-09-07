import { resolve } from 'path';
import { readFileSync } from 'fs';
import { arch, cpus, endianness, freemem, homedir, hostname, loadavg, networkInterfaces, platform, release, tmpdir, totalmem, type, uptime } from 'os';
import { isBoolean, cloneDeep, flattenDeep, map, reduce, isArray, compact as compact$1, isPlainObject, omitBy, uniq as uniq$1, orderBy, assign as assign$1, merge, isEmpty, pick, words, get, camelCase, includes, every, some, forEach, toUpper, omit, toLower, toString, first } from 'lodash';
export { getExtension as mimeExtensionOf, getType as mimeTypeOf } from 'mime';
import { STATUS_CODES } from 'statuses';
import inflection from 'inflection';
import generateColor from 'randomcolor';
import moment from 'moment';
import parseJson from 'parse-json';
import hashObject from 'object-hash';
import renderTemplate from 'string-template';
import stripTags from 'striptags';
import parseValue from 'auto-parse';

/**
 * @name RESOURCE_ACTIONS
 * @description Default resource actions
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @private
 */
const RESOURCE_ACTIONS = [
  'create',
  'view',
  'edit',
  'delete',
  'share',
  'print',
  'import',
  'export',
  'download',
];

/**
 * @function isNotValue
 * @name isNotValue
 * @description Check if variable has no associated state
 * @param {*} value variable to check if it has no associated state
 * @returns {boolean} whether variable contain state
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const notValue = isNotValue('a');
 * // => false
 *
 * const notValue = isNotValue(null);
 * // => true
 */
const isNotValue = value => (isBoolean(value) ? false : !value);

/**
 * @function copyOf
 * @name copyOf
 * @description Recursively clone a value
 * @param {*} value valid value to clone
 * @returns {*} cloned value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.25.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const copy = copyOf('a');
 * // => 'a'
 *
 * const copy = copyOf({ 'a': 1 });
 * // => { 'a': 1 }
 */
const copyOf = value => cloneDeep(value);

/**
 * @function mapToUpper
 * @name mapToUpper
 * @description Convert list of values to upper values
 * @param {...string} values list to convert to upper
 * @returns {string[]} list of upper values
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.12.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const mapToUpper = mapToUpper('a');
 * // => ['A']
 *
 * const mapToUpper = mapToUpper(['a', 'b'], 'c');
 * // => ['A', 'B', 'C']
 */
const mapToUpper = (...values) => {
  // convert lower to upper
  const convertToUpper = value => toUpper(value);
  // collect values
  const lowerValues = flattenDeep([...values]);
  // convert to upper
  const upperValues = map(lowerValues, convertToUpper);
  // return upper values
  return upperValues;
};

/**
 * @function mapToLower
 * @name mapToLower
 * @description Convert list of values to lower values
 * @param {...string} values list to convert to lower
 * @returns {string[]} list of lower values
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.12.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const mapToLower = mapToLower('A');
 * // => ['a']
 *
 * const mapToLower = mapToLower(['A', 'B'], 'C');
 * // => ['a', 'b', 'c']
 */
const mapToLower = (...values) => {
  // convert upper to lower
  const convertToLower = value => toLower(value);
  // collect values
  const upperValues = flattenDeep([...values]);
  // convert to lower
  const lowerValues = map(upperValues, convertToLower);
  // return lower values
  return lowerValues;
};

/**
 * @function areNotEmpty
 * @name areNotEmpty
 * @description Check if provided values are not empty
 * @param {...string} values set of values to check for emptiness
 * @returns {boolean} whether values are not empty
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.2.0
 * @static
 * @public
 * @example
 *
 * const notEmpty = areNotEmpty('a', 'b', 'c');
 * // => true
 *
 * const notEmpty = areNotEmpty('a', 'b', null);
 * // => false
 */
const areNotEmpty = (...values) => {
  // copy values
  const copyOfValues = [...values];
  // check for empty values so far
  const checkForEmpties = (arePreviousEmpty, nextValue) => {
    return arePreviousEmpty && !isEmpty(toString(nextValue));
  };
  // assert for emptiness
  const notEmpty = reduce(copyOfValues, checkForEmpties, true);
  // return emptiness state
  return notEmpty;
};

/**
 * @function compact
 * @name compact
 * @description Creates new array(or object) with all falsey values removed.
 * The values false, null, 0, "", undefined, and NaN are falsey.
 * @param {Array|object} value The array(or object) to compact.
 * @returns {object|Array} new array(or object) of filtered values.
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const b = compact([null, 1, "", undefined]);
 * // => [ 1 ]
 *
 * const y = compact({a: 1, b: "", c: undefined});
 * // => { a: 1 }
 */
const compact = value => {
  // copy value
  const copyOfValue = copyOf(value);

  // compact array
  if (isArray(copyOfValue)) {
    return compact$1(copyOfValue);
  }

  // compact object
  if (isPlainObject(copyOfValue)) {
    return omitBy(copyOfValue, isNotValue);
  }

  // return value
  return copyOfValue;
};

/**
 * @function uniq
 * @name uniq
 * @description Creates new duplicate-free version of array(or object).
 * @param {Array|object} value The array(or object) to inspect.
 * @returns {object|Array} new duplicate free array(or object).
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const b = uniq([null, 1, 1, "", undefined, 2]);
 * // => [ 1, 2 ]
 *
 * const y = uniq({a: 1, b: "", c: undefined});
 * // => { a: 1 }
 */
const uniq = value => {
  // uniq
  if (value) {
    let copyOfValue = compact(value);
    copyOfValue = isArray(value) ? uniq$1(copyOfValue) : copyOfValue;
    return copyOfValue;
  }

  // return value
  return value;
};

/**
 * @function sortedUniq
 * @name sortedUniq
 * @description Creates new duplicate-free version of sorted array(or object).
 * @param {Array|object} value The array(or object) to inspect.
 * @returns {object|Array} new duplicate free sorted array(or object).
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const b = sortedUniq([null, 1, 2, "", undefined, 1]);
 * // => [ 1, 2 ]
 *
 * const y = sortedUniq({a: 1, b: "", c: undefined});
 * // => { a: 1 }
 */
const sortedUniq = value => {
  // sortedUniq
  if (value) {
    let copyOfValue = uniq(value);
    copyOfValue = isArray(copyOfValue) ? orderBy(copyOfValue) : copyOfValue;
    return copyOfValue;
  }

  // return value
  return value;
};

/**
 * @function assign
 * @name assign
 * @description Assign a list of objects into a single object
 *
 * **Note:** This method mutates `object`.
 *
 * @param {object} [object={}] destination object
 * @param {...object} objects list of objects
 * @returns {object} a merged object
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.26.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const obj = { a: 1 };
 * assign(obj, { b: 1 }, { c: 2});
 * // => { a: 1, b: 1, c: 2 }
 */
const assign = (object = {}, ...objects) => {
  // ensure source objects
  let sources = compact$1([...objects]);
  sources = map(sources, compact);

  // assign objects
  assign$1(object, ...sources);

  // return assigned object
  return object;
};

/**
 * @function mergeObjects
 * @name mergeObjects
 * @description Merge a list of objects into a single object
 * @param {...object} objects list of objects
 * @returns {object} a merged object
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.10.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const obj = mergeObjects({ a: 1 }, { b: 1 }, { c: 2}, { c: 2}, {b: null})
 * // => { a: 1, b: 1, c: 2 }
 */
const mergeObjects = (...objects) => {
  // ensure source objects
  let sources = compact$1([...objects]);
  sources = map(sources, compact);

  // merged objects
  const merged = merge({}, ...sources);

  // return merged object
  return merged;
};

/**
 * @function pkg
 * @name pkg
 * @description Read package information
 * @param {string} [path] valid path to package.json file
 * @param {...string} field fields to pick from package
 * @returns {object} current process package information
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.3.0
 * @static
 * @public
 * @example
 *
 * const { name, version } = pkg();
 * // => { name: ..., version: ...}
 *
 * const { name, version } = pkg(__dirname);
 * // => { name: ..., version: ...}
 */
const pkg = (path, ...field) => {
  // try read from path or process cwd
  const read = () => {
    try {
      const filePath = resolve(path, 'package.json');
      const json = parseJson(readFileSync(filePath, 'utf8'));
      return json;
    } catch (e) {
      const filePath = resolve(process.cwd(), 'package.json');
      const json = parseJson(readFileSync(filePath, 'utf8'));
      return json;
    }
  };

  // try read package data
  try {
    const packageInfo = mergeObjects(read());
    const fields = uniq([...field, path]);
    if (!isEmpty(fields)) {
      const info = { ...pick(packageInfo, ...fields) };
      return isEmpty(info) ? { ...packageInfo } : info;
    }
    return packageInfo;
  } catch (e) {
    // no package data found
    return {};
  }
};

/**
 * @function scopesFor
 * @name scopesFor
 * @description Generate resource scopes(permissions)
 * @param {...string} resources resources
 * @returns {Array} resources scopes
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const scopes = scopesFor('user')
 * // => ['user:create', 'user:view']
 */
const scopesFor = (...resources) => {
  // initialize resources scopes
  let scopes;

  // map resource to actions
  const toActions = resource => {
    // map action to wildcard scopes
    const toWildcard = action => {
      // map action to scope(permission)
      const scope = toLower([resource, action].join(':'));
      return scope;
    };
    // create scopes(permissions) per action
    return map(RESOURCE_ACTIONS, toWildcard);
  };

  // generate resources scopes
  if (resources) {
    // copy unique resources
    const copyOfResources = uniq([...resources]);

    // create scopes(permissions) per resource
    scopes = map(copyOfResources, toActions);
    scopes = sortedUniq(flattenDeep(scopes));
  }

  // return resources scopes
  return scopes;
};

/**
 * @function abbreviate
 * @name abbreviate
 * @description Generate shortened form of word(s) or phrase.
 * @param {...string} words set of words to derive abbreaviation
 * @returns {string} abbreviation
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const abbreaviation = abbreviate('Ministry of Finance')
 * // => MoF
 */
const abbreviate = (...words$1) => {
  // ensure words
  let phrases = flattenDeep([...words$1]);
  phrases = words(phrases.join(' '));

  // generate abbreviation
  const pickFirstLetters = (abbr, phrase) => {
    return toUpper(abbr + first(phrase));
  };
  const abbreviation = reduce(phrases, pickFirstLetters, '');

  // return abbreviation
  return abbreviation;
};

/**
 * @function idOf
 * @name idOf
 * @description Obtain an id or a given object
 * @param {object} data object to pick id from
 * @returns {*} id of a given object
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.10.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const id = idOf({ id: 1 })
 * // => 1
 *
 * const id = idOf({ _id: 1 })
 * // => 1
 */
const idOf = data => get(data, '_id') || get(data, 'id');

/**
 * @function variableNameFor
 * @name variableNameFor
 * @description Produce camelize variable name based on passed strings
 * @param {...string} names list of strings to produce variable name
 * @returns {string} camelized variable name
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.10.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const name = variableNameFor('get', 'name');
 * // => getName
 *
 * const name = variableNameFor('pick', 'a', 'name');
 * // => pickAName
 */
const variableNameFor = (...names) => camelCase([...names].join(' '));

/**
 * @function has
 * @name has
 * @description Check if value is in a collection
 * @param {Array} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @returns {boolean} whether value is in collection
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const hasValue = has([ 1, 2 ], 1);
 * // => true
 *
 * const hasValue = has([ 'a', 'b' ], 'c');
 * // => false
 */
const has = (collection, value) => includes(collection, value);

/**
 * @function hasAll
 * @name hasAll
 * @description Check if all value are in a collection
 * @param {Array} collection The collection to inspect.
 * @param {*} values The values to search for.
 * @returns {boolean} whether values are in collection
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const hasValues = hasAll([ 1, 2 ], 1, 2);
 * // => true
 *
 * const hasValues = hasAll([ 1, 2 ], [ 1, 2 ]);
 * // => true
 *
 * const hasValues = hasAll([ 'a', 'b' ], 'c', 'd');
 * // => false
 */
const hasAll = (collection, ...values) => {
  // check if value is in collection
  const checkIfIsInCollection = value => has(collection, value);

  // check if collection has all values
  const flatValues = flattenDeep([...values]);
  const areAllInCollection = every(flatValues, checkIfIsInCollection);

  // return whether collection has all value
  return areAllInCollection;
};

/**
 * @function hasAny
 * @name hasAny
 * @description Check if any value is in a collection
 * @param {Array} collection The collection to inspect.
 * @param {*} values The values to search for.
 * @returns {boolean} whether any value is in collection
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const hasValues = hasAny([ 1, 2 ], 1, 2);
 * // => true
 *
 * const hasValues = hasAny([ 1, 2 ], [ 1, 2 ]);
 * // => true
 *
 * const hasValues = hasAny([ 'a', 'b' ], 'b', 'd');
 * // => true
 *
 * const hasValues = hasAny([ 'a', 'b' ], 'c', 'd');
 * // => false
 */
const hasAny = (collection, ...values) => {
  // check if value is in collection
  const checkIfIsInCollection = value => has(collection, value);

  // check if collection has all values
  const flatValues = flattenDeep([...values]);
  const isAnyInCollection = some(flatValues, checkIfIsInCollection);

  // return whether collection has any value
  return isAnyInCollection;
};

/**
 * @function normalizeError
 * @name normalizeError
 * @description Normalize error instance with name, code, status and message.
 *
 * **Note:** This method mutates `object`.
 *
 * @param {Error} error valid error instance
 * @param {object} [options] additional convert options
 * @param {string} [options.name=Error] default error name
 * @param {string} [options.code=500] default error code
 * @param {string} [options.status=500] default error status
 * @param {string} [options.message=500] default error message
 * @see {@link https://jsonapi.org/format/#errors}
 * @returns {Error} normalized error object
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.26.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const body = normalizeError(new Error('Missing API Key'));
 * // => error.status = 500;
 */
const normalizeError = (error, options = {}) => {
  // ensure options
  let { name = 'Error', code = 500, status, message } = mergeObjects(options);

  // prepare error properties
  code = error.code || error.statusCode || code;
  status = error.status || error.statusCode || status || code;
  name = error.name || name;
  message = error.message || message || STATUS_CODES[code];

  // assign values
  assign(error, { code, status, name, message });

  // return normalized error
  return error;
};

/**
 * @function bagify
 * @name bagify
 * @description Normalize errors bag to light weight object
 * @param {object} errors valid errors bag
 * @returns {object} formatted errors bag
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.14.0
 * @version 0.2.0
 * @static
 * @public
 * @example
 *
 * const body = bagify({name : new Error('Validation Error') });
 * // => { name: { name: 'Error', message: 'Name Required'}, ... }
 */
const bagify = (errors = {}) => {
  // initialize normalize errors bag
  const bag = {};
  // iterate errors ba
  forEach(errors, (error = {}, key) => {
    // simplify error bag
    const {
      message,
      name,
      type,
      kind,
      path,
      value,
      index,
      properties = {},
    } = error;
    const normalized = mergeObjects(
      { message, name, type, kind, path, value, index },
      properties
    );
    // reset key with normalized error
    const props = ['message', 'name', 'type', 'kind', 'path', 'value', 'index'];
    bag[key] = pick(normalized, ...props);
  });
  // return errors bag
  return bag;
};

/**
 * @function mapErrorToObject
 * @name mapErrorToObject
 * @description Convert error instance to light weight object
 * @param {Error} error valid error instance
 * @param {object} [options] additional convert options
 * @param {string} [options.name=Error] default error name
 * @param {string} [options.code=500] default error code
 * @param {string} [options.stack=false] whether to include error stack
 * @param {string} [options.status=500] default error status
 * @see {@link https://jsonapi.org/format/#errors}
 * @returns {object} formatted error object
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.13.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const body = mapErrorToObject(new Error('Missing API Key'));
 * // => { name:'Error', message: 'Missing API Key', ... }
 */
const mapErrorToObject = (error, options = {}) => {
  // ensure options
  const {
    name = 'Error',
    code = 500,
    stack = false,
    status,
    message,
    description,
  } = mergeObjects(options);

  // prepare error payload
  const body = {};
  body.code = error.code || error.statusCode || code;
  body.status = error.status || error.statusCode || status || code;
  body.name = error.name || name;
  body.message = error.message || message || STATUS_CODES[code];
  body.description = error.description || description || body.message;
  body.errors = error.errors ? bagify(error.errors) : undefined;
  body.stack = stack ? error.stack : undefined;

  // support OAuth v2 error style
  // https://tools.ietf.org/html/rfc6749#page-71
  body.uri = get(error, 'error_uri', error.uri);
  body.error = error.error || body.name;
  body.error_description = body.description;
  body.error_uri = body.uri;

  // return formatted error response
  return mergeObjects(body);
};

/**
 * @function osInfo
 * @name osInfo
 * @description Obtain operating system information
 * @returns {object} os information object
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.14.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const info = osInfo();
 * // => { arch:'x64', ... }
 */
const osInfo = () => {
  // collect os information
  const info = {
    arch: arch(),
    cpus: cpus(),
    endianness: endianness(),
    freemem: freemem(),
    homedir: homedir(),
    hostname: hostname(),
    loadavg: loadavg(),
    networkInterfaces: networkInterfaces(),
    platform: platform(),
    release: release(),
    tmpdir: tmpdir(),
    totalmem: totalmem(),
    type: type(),
    uptime: uptime(),
  };
  // return collected os information
  return info;
};

/**
 * @function processInfo
 * @name processInfo
 * @description Obtain current process information
 * @returns {object} current process information
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.15.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const info = processInfo();
 * // => { pid: 8989, ... }
 */
const processInfo = () => {
  // collect process information
  const info = {
    arch: process.arch,
    cpuUsage: process.cpuUsage(),
    cwd: process.cwd(),
    features: process.features,
    egid: process.getegid(),
    euid: process.geteuid(),
    gid: process.getgid(),
    groups: process.getgroups(),
    uid: process.getuid(),
    hrtime: process.hrtime(),
    memoryUsage: process.memoryUsage(),
    pid: process.pid,
    platform: process.platform,
    ppid: process.ppid,
    title: process.title,
    uptime: process.uptime(),
    version: process.version,
    versions: process.versions,
  };
  // return collected process information
  return info;
};

/**
 * @function randomColor
 * @name randomColor
 * @description Generating attractive random colors
 * @param {object} [optns] valid generator options
 * @param {string} [optns.luminosity=light] controls the luminosity of the
 * generated color. you can specify a string containing `bright`, `light` or
 * `dark`.
 * @returns {string} random color
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.18.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const color = randomColor();
 * // => #C349D8
 */
const randomColor = (optns = { luminosity: 'light' }) => {
  const options = mergeObjects(optns);
  const color = toUpper(generateColor(options));
  return color;
};

/**
 * @function formatDate
 * @name formatDate
 * @description Format a data using specified format
 * @param {Date} [date=new Date()] valid date instance
 * @param {string} [format='YYYY-MM-DD'] valid date format
 * @returns {string} formatted date string
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.19.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const date = formatDate(new Date(), 'YYYY-MM-DD');
 * // => 2019-05-30
 */
const formatDate = (date = new Date(), format = 'YYYY-MM-DD') => {
  const formatted = moment(date).format(format);
  return formatted;
};

/**
 * @function hashOf
 * @name hashOf
 * @description Generate hash of provided object
 * @param {object} object valid object to hash
 * @param {...string} [ignore] properties to ignore
 * @returns {string} valid object hash
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.21.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const hash = hashOf({ foo: 'bar' })
 * // => '67b69634f9880a282c14a0f0cb7ba20cf5d677e9'
 */
const hashOf = (object, ...ignore) => {
  // ensure object
  let copyOfObject = mergeObjects(object);
  copyOfObject = omit(copyOfObject, ...ignore);

  // compute hash
  const hash = hashObject(copyOfObject);

  // return computed hash
  return hash;
};

/**
 * @function parseTemplate
 * @name parseTemplate
 * @description Parse, format and render string based template
 * @param {string} template valid template
 * @param {object} data object valid object apply on template
 * @returns {string} formatted string
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.21.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const template = 'Hello {name}, you have {count} unread messages';
 * const formatted = parseTemplate(template, { name: 'John', count: 12 });
 * // => 'Hello John, you have 12 unread messages'
 */
const parseTemplate = (template, data) => {
  // ensure copy
  const copyOfTemplate = copyOf(template);
  const copyOfData = mergeObjects(data);

  // render string template
  const formatted = renderTemplate(copyOfTemplate, copyOfData);

  // return formatted string
  return formatted;
};

/**
 * @function stripHtmlTags
 * @name stripHtmlTags
 * @description Strip HTML tags from a string
 * @param {string} html valid html string
 * @returns {string} string with no html tags
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.21.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const html = 'lorem ipsum <strong>dolor</strong> <em>sit</em> amet';
 * const formatted = stripHtmlTags(html);
 * // => 'lorem ipsum dolor sit amet'
 */
const stripHtmlTags = html => {
  const copyOfHtml = copyOf(html);
  const formatted = stripTags(copyOfHtml);
  return formatted;
};

/**
 * @function stringify
 * @name stringify
 * @description Safely converts a given value to a JSON string
 * @param {*} value valid value
 * @returns {string} JSON string of a value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.22.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const value = { x: 5, y: 6 };
 * const string = stringify(value);
 * // => '{"x":5,"y":6}'
 */
const stringify = value => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    return value;
  }
};

/**
 * @function parse
 * @name parse
 * @description Safely parses a JSON string to a value
 * @param {string} value JSON string of a value
 * @returns {*} valid value
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.22.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const string = '{"x":5,"y":6}';
 * const value = parse(value);
 * // => { x: 5, y: 6 }
 */
const parse = value => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

/**
 * @function pluralize
 * @name pluralize
 * @description Convert a given string value to its plural form
 * @param {string} value subject value
 * @returns {string} plural form of provided string
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.24.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * pluralize('person');
 * // => people
 *
 * pluralize('Hat');
 * // => Hats
 */
const pluralize = value => {
  let plural = copyOf(value);
  plural = inflection.pluralize(value);
  return plural;
};

/**
 * @function singularize
 * @name singularize
 * @description Convert a given string value to its singular form
 * @param {string} value subject value
 * @returns {string} singular form of provided string
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.24.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * singularize('people');
 * // => person
 *
 * singularize('Hats');
 * // => Hat
 */
const singularize = value => {
  let singular = copyOf(value);
  singular = inflection.singularize(value);
  return singular;
};

/**
 * @function autoParse
 * @name autoParse
 * @description Safely auto parse a given value to js object
 * @param {*} value subject to parse
 * @param {...string} [fields] subject fields to apply auto parse
 * @returns {*} valid js object
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.24.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * autoParse('5');
 * // => 5
 *
 * autoParse('{"x":5,"y":6}');
 * // => { x: 5, y: 6 }
 *
 * autoParse({ a: '5', b: '6' }, 'a'))
 * // => { a: 5, b: '6' }
 */
const autoParse = (value, ...fields) => {
  const copyOfValue = copyOf(value);
  // handle plain object
  if (isPlainObject(copyOfValue)) {
    let parsed = pick(copyOfValue, ...fields);
    parsed = isEmpty(parsed) ? copyOfValue : parsed;
    parsed = parseValue(parsed);
    return merge(copyOfValue, parsed);
  }
  // handle others
  return parseValue(copyOfValue);
};

export { RESOURCE_ACTIONS, abbreviate, areNotEmpty, assign, autoParse, bagify, compact, copyOf, formatDate, has, hasAll, hasAny, hashOf, idOf, isNotValue, mapErrorToObject, mapToLower, mapToUpper, mergeObjects, normalizeError, osInfo, parse, parseTemplate, pkg, pluralize, processInfo, randomColor, scopesFor, singularize, sortedUniq, stringify, stripHtmlTags, uniq, variableNameFor };
