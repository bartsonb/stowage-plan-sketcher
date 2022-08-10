const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

handlebars.registerHelper('getBase64Image', (string) => {
	return new handlebars.SafeString(`<img src='${string}' alt='' />`);;
})

exports.create = async (data) => {
	return new Promise(async (resolve, reject) => {
		const folderPath = path.join(__dirname, "..", "files", data.userId);
		const finalPath = path.join(folderPath, `${data.shipName}-${data.uuid}.pdf`);
	
		// Render template.html with the data applied.
		const templateHtmlFile = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
		const template = handlebars.compile(templateHtmlFile)
		const html = template(data);
		
		// Make user folder for pdf files.
		if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
	
		const browser = await puppeteer.launch({
			ignoreDefaultArgs: ["--disable-extensions"],
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
	
		resolve(finalPath);
	});
}