export const createResponse = ({ status = "200", result = null, message = "", error = "" }) => {
    return {
      status,
      result,
      message,
      error,
    };
  };
