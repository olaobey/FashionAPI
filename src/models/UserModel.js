const pool = require("../db/config");

class User {
  /**
   * Adds new user to the database
   *
   * @param {Object} data Data about user
   * @return {Oject|null} The new user
   */
  async create(data) {
    try {
      //pg query
      const createQuery = `INSERT INTO users ( first_name, last_name, email, Password, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      //pg values
      const values = [
        data.first_name,
        data.last_name,
        data.email,
        data.Password,
        data.phone_number,
      ];

      console.log(data.first_name);
      //Make query
      const result = await pool.query(createQuery, values);
      // check for valid results
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates a user in the database
   *
   * @param {Obj} data Data about user to update
   * @return {Oject|null} The updated user
   */
  async update(data) {
    try {
      //pg query
      const createQuery = `UPDATE users SET email=$2, hashPassword=$3, first_name=$4, last_name=$6, modified=now() WHERE id = $1 RETURNING *`;

      // pg values
      const values = [
        data.id,
        data.email,
        data.hashPassword,
        data.first_name,
        data.last_name,
      ];
      // make query
      const result = await pool.query(createQuery, values);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Update a user's  primary_address_id in the database
   *
   * @param {Obj} data Data about user to update
   * @return {Oject|null}The updated user
   */
  async updatePrimaryAddressId(data) {
    try {
      //pg query
      const createQuery = `UPDATE users SET primary_address_id=$2, modified=now() WHERE id = $1 RETURNING *`;

      // pg values
      const values = [data.id, data.primary_address_id];

      // make query
      const result = await pool.query(createQuery, values);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates a user's primary_payment_id in the database
   *
   * @param {Obj} data Data about user to update
   * @return {Oject|null} The updated user
   */
  async updatePrimaryPaymentId(data) {
    try {
      // pg query
      const createQuery = `UPDATE users SET primary_payment_id=$2, modified=now() WHERE id = $1 RETURNING *`;

      // pg values
      const values = [data.id, data.primary_payment_id];

      // make query
      const result = await pool.query(createQuery, values);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Returns user associated with id in database, if exists
   *
   * @param {number} id the id to find user based on
   * @return {Object|null} the user
   */
  async findById(id) {
    try {
      // pg query
      const createQuery = `SELECT * FROM users WHERE id = $1`;

      // make query
      const result = await pool.query(createQuery, [id]);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(err);
    }
  }

  /**
   * Return user associated with email in database, if exists
   *
   * @param {string} email the email to find user based on
   * @return {Object|null} the user
   */
  async findByEmail(email) {
    try {
      // pg query
      const createQuery = `SELECT * FROM users WHERE email = $1`;

      // make query
      const result = await pool.query(createQuery, [email]);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Deletes user associated with email in database, if exists
   * For use with testing, not for use with production.
   *
   * @param {string} email the email to delete user based on
   * @return {Object|null} the user
   */
  async deleteByEmail(id) {
    try {
      // pg query
      const createQuery = `DELETE FROM users WHERE email=$1 RETURNING *`;

      // make query
      const result = await pool.query(createQuery, [id]);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = new User();
