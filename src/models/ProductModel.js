const pool = require("../db/config");

class Product {
  /**
   * Returns product associated with id in database, if exists
   *
   * @param {integer} id the id to find product based on
   * @return {Object|null} the product
   */
  async findById(id) {
    try {
      // pg query
      const createQuery = `SELECT *, 
                                    quantity>0 AS "in_stock" 
                                FROM products 
                                WHERE id = $1`;

      // make query
      const result = await db.query(createQuery, [id]);

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
   * Returns products in the specified category, if exists
   *
   * @param {string} category the catgory to find products based on
   * @return {Array|null} the product(s) in the category
   */
  async findByCategory(category) {
    try {
      // pg query
      const createQuery = `SELECT *, 
                                    quantity>0 AS "in_stock" 
                                FROM products 
                                WHERE category = $1`;

      // make query
      const result = await pool.query(createQuery, [category]);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Returns products in the specified query, if exists
   *
   * @param {String} query the query to find products based on
   * @return {Array|null} the product(s) that fit the query
   */
  async findByQuery(query) {
    try {
      // pg query
      const createQuery = `SELECT * , 
                                    quantity>0 AS "in_stock"
                                FROM products 
                                WHERE LOWER(description) 
                                LIKE LOWER('%' || $1 || '%')`;

      // make query
      const result = await pool.query(createQuery, [query]);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Returns all products in the database
   *
   * @return {Array|null} the product(s), if there are any on the database
   */
  async getAll() {
    try {
      // pg query
      const createQuery = `SELECT *, 
                                    quantity>0 AS "in_stock" 
                                FROM products`;

      // make query
      const result = await pool.query(createQuery);

      // check for valid results
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates quantity of product associated with id in database, if exists
   *
   * @param {integer} id the id to find product based on
   * @param {integer} amount the amount added or removed from quantity (positive or negative value)
   * @return {Object|null} the product
   */
  async updateQuantity(id, amount) {
    try {
      // pg query
      const createQuery = `UPDATE products
	                            SET quantity=quantity + $2, modified=now()
	                            WHERE id=$1 
                                RETURNING *, quantity>0 AS "in_stock"`;

      // make query
      const result = await pool.query(createQuery, [id, amount]);

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

module.exports = new Product();
