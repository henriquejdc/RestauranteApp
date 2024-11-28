import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API do Restaurante",
            version: "1.0.0",
            description: "Documentação da API para gerenciamento de comandas e ordens de produção",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ['./controller/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
