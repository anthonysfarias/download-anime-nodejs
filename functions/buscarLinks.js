async function getLinks(page, selector, pageURL, browser) {
    console.log(`URL: ${pageURL}`);
    const elements = await page.$$(selector);
    const linkHrefList = [];
    for (const element of elements) {
      const href = await element.evaluate((el) => el.getAttribute("href"));
      if (href) {
        const fullUrl = pageURL + href;
        console.log(`Full URL: ${fullUrl}`);
        const newPage = await browser.newPage();
        await newPage.goto(fullUrl, { waitUntil: "domcontentloaded" });
        // Aguarda o carregamento da página e do elemento desejado
        await newPage.waitForSelector(".reportContent:nth-child(3) a");
        const linkHref = await newPage.evaluate(() => {
          const thirdReportContentLink = document.querySelector(
            ".reportContent:nth-child(3) a"
          );
          return thirdReportContentLink.getAttribute("href");
        });
        linkHrefList.push(linkHref);
        newPage.close();
      }
      console.log("[+] Link Adicionado:", linkHrefList.length);
    }
    return linkHrefList;
  }

module.exports = getLinks;
