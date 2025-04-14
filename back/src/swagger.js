import swaggerAutogen from "swagger-autogen"

const doc = {
    info: {
        title: "API",
        version: "1.0.0",
        description: "API documentation"
    },
    servers: [
      {
        url: "http://192.168.11.95:3013",
        description: "Development server"
      }
    ],
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
}

const outputFile = "./src/swagger.json"
const routes = ["./src/routes/userRoutes.js", "./src/routes/funcionarioRoutes.js", "./src/routes/pontoRoutes.js"]

swaggerAutogen({openapi: '3.1.0'})(outputFile, routes, doc)