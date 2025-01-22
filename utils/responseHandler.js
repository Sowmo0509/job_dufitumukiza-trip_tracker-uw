export const createResponse = ({
  status = "200",
  result = null,
  message = "",
  error = "",
}) => {
  const response = { status, message };

  if (error) {
    response.error = error;
  } else if (result) {
    response.result = result;
  }

  return response;
};
