import { Injectable } from '@nestjs/common';
import * as pupiter from 'puppeteer';

@Injectable()
export class PuppeteerService {
  async browserObject() {
    const browser = await pupiter.launch({
      headless: true, //true - off browser view/ false - on view browser
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
    return browser;
  }
}
