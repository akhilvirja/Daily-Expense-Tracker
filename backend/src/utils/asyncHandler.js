/**
 * Wrapper for async route handlers to eliminate the need for try/catch blocks
 * and automatically pass any caught errors to the Express error handling middleware.
 * 
 * @param {Function} fn - The asynchronous route handler function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
