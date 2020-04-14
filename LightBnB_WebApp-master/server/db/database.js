const properties = require('../json/properties.json');
const users = require('../json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
    .then((res) => {
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        return null;
      }
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1
  `, [id])
    .then((res) => {
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        return null;
      }
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
    .then((res) => {
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        return null;
      }
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  return pool.query(`
  SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < Now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guest_id, limit])
    .then((res) => {
      if (res.rows.length > 0) {
        return res.rows;
      } else {
        return null;
      }
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  LEFT JOIN property_reviews ON property_reviews.property_id = properties.id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    if (queryParams.length > 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `cost_per_night >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `cost_per_night <= $${queryParams.length}`;
  }

  if (options.minimum_rating) {
    if (queryParams.length > 0) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }
    queryParams.push(`${options.minimum_rating}`);
    queryString += `property_reviews.rating >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((res) => {
      return res.rows;
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = (property) => {
  property.cost_per_night *= 100;
  const keys = Object.keys(property);
  const values = Object.values(property);
  const queryParams = [];
  let queryString1 = `
  INSERT INTO properties (
  `;

  let queryString2 = `
  ) VALUES (
  `;

  for (let i = 0; i < keys.length; i++) {
    queryParams.push(values[i]);
    queryString1 += `${keys[i]}`;
    queryString2 += `$${queryParams.length}`;
    if (i !== keys.length - 1) {
      queryString1 += `, `;
      queryString2 += `, `;
    }
  }

  let queryString = `${queryString1}${queryString2}) RETURNING *;`;

  return pool.query(queryString, queryParams)
    .then((res) => {
      return res.rows;
    });
}
exports.addProperty = addProperty;
