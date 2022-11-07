import { Injectable } from '@nestjs/common';
import { PuppeteerService } from './Services/pupettir.service';
import * as userAgent from 'user-agents';
import { base_url } from './Constant/base_url';
import { ResultI } from './Type/result.type';

@Injectable()
export class AppService {
  constructor(private puppeteerService: PuppeteerService) {}

  async parseData(): Promise<any> {
    const startTime = performance.now();
    const { page, browser } = await this.BrowserSetUp();
    await page.goto(base_url, {
      waitUntil: 'networkidle0',
    });

    await page.waitForSelector('div #data');

    let result: ResultI = JSON.parse(
      await page.evaluate(() => {
        return document.querySelector('div #data').textContent;
      }),
    );

    console.log(result.sign);

    const endTime = performance.now();
    const amountTime = this.convertMsToSecon(endTime - startTime);
    console.log(amountTime + 's');
  }

  private async BrowserSetUp() {
    const browser = await this.puppeteerService.browserObject();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    const USER_AGENT =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
    await page.setUserAgent(USER_AGENT);
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1],
      });
    });
    return { page, browser };
  }

  convertMsToSecon(ms: number) {
    return Math.floor((ms / 1000) % 60);
  }
}
