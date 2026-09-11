// Verificação em navegador real. Playwright é ferramenta de desenvolvimento, não dependência do site.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage();
 const failures=[];const runtime=[];
 page.on('pageerror',error=>runtime.push(error.message));
 const files=fs.readdirSync('.').filter(p=>p.endsWith('.html'));
 const requiredExternalLinks=['https://ridigital.org.br/','https://portal.tjpe.jus.br/documents/d/corregedoria/tabela-emolumentos-2025-pdf','https://portal.tjpe.jus.br/documents/d/corregedoria/codigo-de-normas-compilado-novo-19-02-2026-pdf','https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm','https://www.planalto.gov.br/ccivil_03/leis/l8935.htm','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'];
 fs.mkdirSync('qa',{recursive:true});
 for(const width of [320,360,375,390,430,768,1024,1440,1920]){
  await page.setViewportSize({width,height:900});
  for(const file of files){
   await page.goto(pathToFileURL(path.resolve(file)).href);
   await page.evaluate(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible')));
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>!i.hidden&&i.complete&&i.naturalWidth===0).map(i=>i.src)}));
   if(result.overflow||result.h1!==1||result.broken.length)failures.push({width,file,...result});
  }
 }
 await page.setViewportSize({width:375,height:812});
 await page.goto(pathToFileURL(path.resolve('index.html')).href);
 await page.locator('.menu-toggle').click();
 if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')failures.push('Menu did not open');
 await page.locator('.dropdown-toggle').click();
 if(!await page.locator('.dropdown-menu').isVisible())failures.push('Dropdown did not open');
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')failures.push('Menu did not close');
 await page.locator('.menu-toggle').click();
 await page.locator('.nav > .button').focus();await page.keyboard.press('Tab');
 if(!await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement))failures.push('Focus trap failed');
 await page.keyboard.press('Escape');
 await page.locator('.theme-toggle').click();
 if(await page.locator('.theme-toggle').getAttribute('aria-pressed')!=='true'||await page.locator('html').getAttribute('data-theme')!=='dark')failures.push('Dark mode failed');
 await page.goto(pathToFileURL(path.resolve('servicos.html')).href);
 if(await page.locator('html').getAttribute('data-theme')!=='dark')failures.push('Theme persistence failed');
 await page.locator('.theme-toggle').click();
 await page.goto(pathToFileURL(path.resolve('registro-imoveis.html')).href);
 await page.locator('summary').first().click();
 if(await page.locator('summary').first().getAttribute('aria-expanded')!=='true')failures.push('Accordion failed');
 await page.goto(pathToFileURL(path.resolve('contato.html')).href+'?servico=certidoes');
 if(await page.locator('#servico').inputValue()!=='certidoes')failures.push('Service prefill failed');
 await page.getByRole('button',{name:'Preparar e-mail'}).click();
 if(await page.locator('[aria-invalid=true]').count()<6)failures.push('Empty form validation failed');
 await page.locator('#nome').fill('Pessoa de Teste');await page.locator('#email').fill('teste@example.com');await page.locator('#telefone').fill('(81) 99999-9999');await page.locator('#assunto').fill('Informações');await page.locator('#mensagem').fill('Gostaria de orientações sobre uma certidão.');await page.locator('#privacidade').check();
 await page.evaluate(()=>{window.open=()=>null});
 await page.getByRole('button',{name:'Preparar e-mail'}).click();
 if(!(await page.locator('#form-status').innerText()).includes('Nenhuma mensagem foi enviada automaticamente'))failures.push('Mail feedback failed');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(pathToFileURL(path.resolve('index.html')).href);
 if(await page.locator('h1').evaluate(el=>getComputedStyle(el).animationName)!=='none')failures.push('Reduced motion failed');
 for(const [width,height,suffix] of [[1440,1000,'desktop'],[375,812,'mobile']]){
  await page.setViewportSize({width,height});
  for(const file of ['index.html','contato.html','institucional.html']){
   await page.goto(pathToFileURL(path.resolve(file)).href);
   await page.evaluate(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible')));
   if(file==='contato.html'){await page.locator('.map-panel').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);await page.evaluate(()=>{scrollTo(0,0);document.activeElement?.blur()});}
   await page.screenshot({path:`qa/${file.replace('.html','')}-${suffix}.png`,fullPage:true});
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(pathToFileURL(path.resolve('index.html')).href);
 await page.locator('.theme-toggle').click();
 await page.evaluate(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible')));
 await page.screenshot({path:'qa/index-dark-desktop.png',fullPage:true});
 await page.locator('.theme-toggle').click();
 const plain=await browser.newPage({javaScriptEnabled:false,viewport:{width:375,height:812}});
 await plain.goto(pathToFileURL(path.resolve('index.html')).href);
 if(!await plain.locator('h1').isVisible()||!await plain.locator('a[href="servicos.html"]').first().isVisible())failures.push('No-JS content/navigation failed');
 for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  if(html.includes('mailto:'))failures.push({file,error:'mailto found'});
  const backHome=(html.match(/Voltar para a página inicial/g)||[]).length;
  if((file==='index.html'&&backHome!==0)||(file!=='index.html'&&backHome!==1))failures.push({file,error:'home return count',backHome});
  if(!html.includes('Desenvolvido por: Filipe Gualberto'))failures.push({file,error:'developer credit missing'});
  for(const [,href]of html.matchAll(/href="([^"]+)"/g)){
   if(/^(https?:|tel:|mailto:|#)/.test(href))continue;
   if(!fs.existsSync(href.split(/[?#]/)[0]))failures.push({file,href});
  }
 }
 const index=fs.readFileSync('index.html','utf8');
 for(const url of requiredExternalLinks)if(!index.includes(url))failures.push({file:'index.html',error:'external link missing',url});
 const contact=fs.readFileSync('contato.html','utf8');
 if(!contact.includes('class="map-panel"')||!contact.includes('output=embed'))failures.push({file:'contato.html',error:'embedded map missing'});
 const reurb=fs.readFileSync('reurb.html','utf8');
 if(!reurb.includes('1uuD1lrPmMU7AxN7tnDuBhAUB9ZWE62L7'))failures.push({file:'reurb.html',error:'REURB materials missing'});
 const report={pages:files.length,viewportWidths:[320,360,375,390,430,768,1024,1440,1920],routeViewportChecks:81,failures,runtimeErrors:runtime};
 fs.writeFileSync('qa/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(failures.length||runtime.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
