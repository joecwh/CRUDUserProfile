const phoneNumberRegex = /^(01[0-9]-[0-9]{3} [0-9]{4}|01[0-9] [0-9]{3} [0-9]{4})$/;

/**
 * Validates a phone number using regex.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {boolean} - True if valid, otherwise false.
 */
export const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumberRegex.test(phoneNumber);
};
