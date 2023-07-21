async function downloadLinks(browser, links_list) {
    console.log(`\f\n Downloaded links [Started]`);
    for (const link of links_list) {
      const downloadPage = await browser.newPage();
      await downloadPage.goto(link, { waitUntil: "domcontentloaded" });
      // Aguarde até que o elemento 'div.ptboxon' esteja visível na página.
      await downloadPage.waitForSelector("div.ptboxon");
      // Clique no botão com a classe 'btn-danger', que é o botão "CRIAR DOWNLOAD".
      const button = await downloadPage.$("button.btn.btn-danger");
      if (button) {
        await button.click();
      } else {
        console.error("Botão não encontrado ou não é interagível.");
      }
  
      await downloadPage.waitForTimeout(5000); // Aguarda 3 segundos (3000 milissegundos) antes de fechar o navegador.
      // // Clique no link de download
      await downloadPage.click("a.novobotao.download");
  
      await downloadPage.close();
    }
    return 1;
  }

  module.exports = downloadLinks