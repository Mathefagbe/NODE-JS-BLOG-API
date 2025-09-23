const {
  PORT,
  CONNECTION_URL,
  JWT_SECRET,
  EMAIL_HOST_USER,
  EMAIL_HOST_PASSWORD,
} = process.env;

module.exports = {
  port: PORT,
  connection_url: CONNECTION_URL,
  jwtSecret: JWT_SECRET,
  host_user: EMAIL_HOST_USER,
  host_password: EMAIL_HOST_PASSWORD,
};
