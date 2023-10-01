require("dotenv").config();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

const app = require("./app");

const PORT = process.env.PORT || 3000

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Video upload api doc",
            version: "0.0.1",
            description: "API for video upload and transcript."
        },
        servers: [
            {
                url: "http://localhost:3000/"
            },
            {
                url: "https://video-upload-api.onrender.com/"
            },
        ],
    },
    apis: ["./app.js"],
};

const spacs = swaggerJsdoc(options);

app.use(
    "/api-docs",
    swaggerui.serve,
    swaggerui.setup(spacs)
    )
app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
