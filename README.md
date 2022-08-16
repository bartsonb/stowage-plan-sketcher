# Stowage Plan Sketcher

This is a web-based 2D stowage plan sketcher that helps you with creating, importing and exporting stowage plans.

![main application](/docs/images/application.png)

# Features

## Placing, moving and aligning cargo
![placing, moving, aligning of cargo](/docs/gif/create-and-align.gif)

## Exporting as PDF
![pdf excerpt](/docs/images/pdf-excerpt.png)

# Details
## Tech stack

The project was realized in the MERN stack and setup with CRA using the typescript template. The node-based API is using Express and MongoBD with the help of mongoose to supply the React frontend with data. Authentification and validation is done using JWTs and hapi/joi. Special thanks to handlebars and puppeteer for carrying the PDF export feature.

## Run the project

To start the project (both frontend and backend with docker), run:

```shell
docker-compose up -d
```

