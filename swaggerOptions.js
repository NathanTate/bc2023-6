const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Devices',
        version: '1.0.0',
        description: 'Small CRUD application build using express.js',
      },
      basePath: '/',
    },
    apis: ['./routes/*.js'],
  };
  
  module.exports = swaggerOptions;
  