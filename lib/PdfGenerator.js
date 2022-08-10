const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

exports.create = async (data) => {
    const folderPath = path.join(__dirname, "..", "files");
	const finalPath = path.join(folderPath, `${data.shipName}-${data.uuid}.pdf`);

	// Render template.html with the data applied.
	const templateHtmlFile = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
	const template = handlebars.compile(templateHtmlFile)
	const html = template(data);
	
	// Make user folder for pdf files.
	if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

	const browser = await puppeteer.launch({
		args: ["--no-sandbox"],
		headless: true
	});

	const page = await browser.newPage();
	
	await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: "networkidle0"
	});

	await page.pdf({
		format: "A4",
		headerTemplate: "<p></p>",
		footerTemplate: "<p></p>",
		displayHeaderFooter: false,
		margin: {
			left: "72px", 
			right: "64px",
			top: "64px",
			bottom: "64px"
		},
		printBackground: true,
		path: finalPath
	});

	await browser.close();

	return finalPath;
}