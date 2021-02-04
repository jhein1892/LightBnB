const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {
  Pool
} = require('pg');

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
const getUserWithEmail = function (email) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE users.email = $1`, [email])
    .then(res => res.rows[0])
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE users.id = $1`, [id])
    .then(res => res.rows[0])
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  `, [user.name, user.email, user.password])
}
exports.addUser = addUser;

/// Reservations 

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations.*, properties.*, avg(property_reviews.rating)
FROM reservations
JOIN users ON guest_id=users.id
JOIN properties ON property_id=properties.id
JOIN property_reviews ON reservations.id=reservation_id
WHERE users.id = $1
AND end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY start_date 
LIMIT $2; 
  `, [guest_id, limit])
  .then(res => res.rows)
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`); 
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night*100}`);
    if (queryParams.length > 1){
    queryString += `AND cost_per_night >= $${queryParams.length}`;
    } else { 
      queryString += `WHERE cost_per_night >= $${queryParams.length}`;
    }
  }
  if (options.owner_id){
    queryParams.push(`${options.owner_id}`);
    if (queryParams.length > 1){
      queryString += `AND properties.owner_id = $${queryParams.length}`;
    } else {
      queryString += `WHERE properties.owner_id = $${queryParams.length}`;
    }
  }
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night*100}`);
    if (queryParams.length > 1){
    queryString += `AND cost_per_night < $${queryParams.length}`;
    } else {
      queryString += `WHERE cost_per_night < $${queryParams.length}`;
    }
  }
  if(options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
      queryString += `
      GROUP BY properties.id
      HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  } else {
    queryString += `
    GROUP BY properties.id`;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;