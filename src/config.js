const dev = {
  apiGateway: {
    REGION: "eu-west-1",
    URL: "https://3otogcf463.execute-api.eu-west-1.amazonaws.com/dev",
  },
  cognito: {
    REGION: "eu-west-1",
    USER_POOL_ID: "eu-west-1_r76mRYHjo",
    APP_CLIENT_ID: "5c7qrfafua38vhsohq1te8hrnu",
    IDENTITY_POOL_ID: "eu-west-1:64b307fd-7e93-4d00-8e09-92525052b56b",
  },
};

const prod = {
  apiGateway: {
    REGION: "eu-west-1",
    URL: "https://0a8eyfqyf4.execute-api.eu-west-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "eu-west-1",
    USER_POOL_ID: "eu-west-1_4TCOG4Nk7",
    APP_CLIENT_ID: "4p1la2qmqurfjroakf1an5ps5t",
    IDENTITY_POOL_ID: "eu-west-1:0fbb5d58-b832-486d-a3d0-4d8f0c28a8ef",
  },
};

const config = {
  // Add common config values here
  ...(process.env.REACT_APP_STAGE === "prod" ? prod : dev),
};

export default config;
