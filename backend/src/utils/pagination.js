/**
 * Parse pagination parameters from request query
 * @param {Object} query - Express req.query
 * @param {Object} defaultOptions - Default pagination options
 * @returns {Object} - { page, limit, skip }
 */
export const getPaginationParams = (query = {}, defaultOptions = { page: 1, limit: 10 }) => {
  const page = Math.max(1, parseInt(query.page, 10) || defaultOptions.page || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || defaultOptions.limit || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Format pagination metadata
 * @param {number} total - Total number of records
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination metadata
 */
export const getPaginationMeta = (total = 0, page = 1, limit = 10) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  };
};
