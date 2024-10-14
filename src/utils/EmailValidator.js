const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address using regex.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
const isValidEmail = (email) => emailRegex.test(email);

module.exports = {
    isValidEmail,
};
