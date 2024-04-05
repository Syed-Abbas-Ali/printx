import log from '../logger/index.js';
import { errorHandler } from '../middleware/error_handler.js';
import routerV1 from './v1/index.js';
// import swaggerUi from 'swagger-ui-express';
// import { config } from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';
// import YAML from 'js-yaml';
// import { swaggerServe, swaggerSetup } from  '../../config.js'
  



// Load environment variables from .env file
// config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

export default function initializeRoutes(app) {
  log.info('initializeRoutes()');

  app.get("/",(res,resp)=>{ 
    resp.send('results'); 
});


  // Load the Swagger YAML file
  // const swaggerDocument = YAML.load(
  //   resolve(dirname(fileURLToPath(import.meta.url)), './printx-doc.yml')
  // );

  // Serve Swagger UI
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Set up API routes for v1
  app.use('/api/v1/', routerV1);

  // Handle 404 errors
  app.get('*', function (req, res) {
    res.status(404).send('Not Found');
  });

  // Use the error handler middleware
  app.use(errorHandler);
}
