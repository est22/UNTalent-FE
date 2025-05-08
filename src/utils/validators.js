/**
 * 이메일 유효성을 검사하는 함수
 * @param {string} email - 검사할 이메일 주소
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return {
        isValid: false,
        error: "Email is required"
      };
    }
    if (email.length > 254) {
      return {
        isValid: false,
        error: "Email is too long"
      };
    }
    if (email.includes(' ')) {
      return {
        isValid: false,
        error: "Email cannot contain spaces"
      };
    }
    if (email.includes('..')) {
      return {
        isValid: false,
        error: "Email cannot contain consecutive dots"
      };
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: "Please enter a valid email address"
      };
    }
    return {
      isValid: true,
      error: ""
    };
  };