const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const downloadLinks = require("./functions/baixarLinks");
const getLinks = require("./functions/buscarLinks");

(async () => {
  const downloadDirectory = path.resolve(__dirname, "downloads"); // Substitua 'downloads' pelo caminho do diretório que você deseja usar

  // Cria o diretório de download, caso não exista
  if (!fs.existsSync(downloadDirectory)) {
    fs.mkdirSync(downloadDirectory);
  }
  // Caminho para o executável do Brave no Ubuntu
  const executablePath = "/usr/bin/brave-browser-stable";

  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const pageURL = "https://www.hinatasoul.com";
  const baseUrl =
    "https://www.hinatasoul.com/animes/kage-no-jitsuryokusha-ni-naritakute";
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "./downloads",
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  // Obter o atributo "href" e abrir uma nova guia para cada elemento "ultimosEpisodiosHomeItem"
  const linkDownload = await getLinks(
    page,
    ".ultimosEpisodiosHomeItem a",
    pageURL,
    browser
  );
  console.table(linkDownload);
  const downloaded = await downloadLinks(browser, linkDownload);
  if (downloaded === 1) {
    await page.waitForTimeout(10000);
    // Feche o navegador após as ações
    await browser.close();
  }
})();
