# Stowage Plan Sketcher

This is a web-based 2D stowage plan sketcher built with MERN, that helps you create, import and export stowage plans. It is supposed fill the middle ground between extremely complex naval stowage plans and simple hand-drawn sketches by students of naval architecture.

![main application](/docs/images/application.png)

# Features
A quick overview of the main features:

## Placing, moving and aligning cargo
You can create stowage plans by using the tools supplied by this application.

![placing, moving, aligning of cargo](/docs/gif/create-and-align.gif)

## Saving and loading of sketches
All sketches can be saved at anytime and are hosted on the web server. That means you can resume work anytime you feel like it with no worrying about data loss.

## Exporting as PDF
One of the most important feature of this application is the ability to export sketches as PDFs. Below is an example of such a file.

![pdf excerpt](/docs/images/pdf-excerpt.png)

# Details
## Tech stack

The project was realized in the MERN stack and setup with CRA using the typescript template. The node-based API is using Express and MongoBD with the help of mongoose to supply the React frontend with data. Authentification and validation is done using JWTs and hapi/joi. Special thanks to handlebars and puppeteer for carrying the PDF export feature.

## Run the project

To start the project (both frontend and backend with docker), run:

```shell
docker-compose up -d
```

