const express = require('express');
const request = require('request-promise');
const fs  = require('fs');
const cheerio = require('cheerio');
const app = express();

const url = 'https://www.blibli.com/search?s';

const main = async (req,res) => {
  const p = req.query.product || '';
  const querySearch = p.replace(/ /g,'-');
  const fetchURL = `${url}=${querySearch}`;
  console.log(fetchURL);
  const options = {
    uri : fetchURL,
    headers : {
      'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
      'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.',
      'Accept-Languange' : 'en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4',
    },
    resolveWithFullResponse: true,
    transform : (body) => {
      fs.writeFile('file.html',body,(err) => {
        if(!!err) console.log(err)
          console.log("Done")
      })
      return cheerio.load(body);
    }
  }

  const $ = await request(options)
  .catch((err) => {
    console.log("Error = "+JSON.stringify(err.response.headers))
    fs.writeFile('error.html',err.response.body,(err) => {
      console.log("Error Message written");
    })
  });

  if(!!$){

    const products = await $('.product-detail-wrapper .single-product').map((i,elem) => {
      const product_block = '.product-detail .product-preview .product-block';
      const product_title = $(elem).find(`${product_block} .product-title`).attr('title');
      const product_price = $(elem).find(`${product_block} .product-price .new-price .new-price-text`).html();
      const product_image = $(elem).find(`${product_block} .product-image .img-lazy-container img`).attr('data-original');;
      const product_details = {
        id    : Math.floor((Math.random() * 12) + 1),
        name : product_title,
        price : product_price,
        type : 'watch',
        image : product_image,
      };

      return product_details;
    }).get();

    const data = {data : products};
    res.send(data)
  }
}

module.exports = main;