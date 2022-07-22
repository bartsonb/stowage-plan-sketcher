/**
 * @desc    Removes all keys in the given object that are not listed in the given array.
 * @param   validKeys: array
 * @param   object: object
 * @returns Object
 */
exports.only = (validKeys, object) => {
    let newObject = {};

    Object.keys(object.toJSON()).forEach(key => {
        if (validKeys.includes(key)) newObject[key] = object[key]
    });

    return newObject;
};

/**
 * @desc    Removes all keys in the given object that are listed in the given array.
 * @param   validKeys: array
 * @param   object: object
 * @returns object
 */
exports.except = (validKeys, object) => {
    let newObject = {};

    Object.keys(object.toJSON()).forEach(key => {
        if (!validKeys.includes(key)) newObject[key] = object[key]
    });

    return newObject;
};

/**
 * @desc    Takes a query object and parses the values to a new type.
 * @param   query: object
 * @returns object
 */
exports.convertQuery = (query) => {
    let output = {};

    Object.keys(query).forEach(key => {
        switch(key) {
            case 'clear':
                output[key] = query[key] === 'true';
                break;
            case 'position':
                output[key] = query[key].split(',').map(el => parseFloat(el));
                break;
            case 'speed':
            case 'heading':
                output[key] = parseFloat(query[key]);
        }
    });

    return output;
};

/**
 * @desc    Checks if given object is empty / has no properties.
 * @param   object: object
 * @returns boolean
 */
exports.isEmpty = (object) => {
    for (let key in object) {
        if (object.hasOwnProperty(key))
            return false;
    }

    return true;
};