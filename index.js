const express = require('express')
const path = require('path')
const fs = require("fs")
const { json } = require('express/lib/response')
const PORT = process.env.PORT || 5000
const undici = require("undici")
const funcaptcha = require("funcaptcha")

var https = require("https");
var {SocksProxyAgent} = require("socks-proxy-agent");


const app = express();

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms*1000);
  });
}

app.get("/test", async (req, ExpressReturn) => {
https.get('https://ipinfo.io', (res) => {
  res.on('data', function (chunk) {
    ExpressReturn.type('text/plain');
    ExpressReturn.send(chunk)
  });  
}); 
});


app.get("/", async (req, ExpressReturn) => {
  const info = {
    hostname: 'geo.iproyal.com',
    userId: 'ebic',
    password: 'diegomg',
    port: 42324
  };
  const agent = new SocksProxyAgent(info);
  https.get('https://condorbx.onrender.com/test', {agent}, (res) => {
    res.on('data', function (chunk) {
      ExpressReturn.type('text/plain');
      ExpressReturn.send(chunk)
    });  
  });
      
  });



app.get("/Load", async (req, ExpressReturn) => {
  console.log("dsds")
  const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
  undici.request("https://auth.roblox.com/v2/signup", {
    method: "POST",
  }).then(async res => {
    
    const csrf = res.headers["x-csrf-token"]
    const res2 = await undici.request("https://auth.roblox.com/v2/signup", {
        method: "POST",
        headers: {
            "x-csrf-token": csrf,
            "content-type": "application/json",
            "user-agent": USER_AGENT
        },
        body: JSON.stringify({
            "username": "",
            "password": "",
        })
    })
    
    const body = await res2.body.json()
    const fieldData = body.errors[0].fieldData.split(",")
    setTimeout(async () => {
      const token = await funcaptcha.getToken({
        pkey: "A2A14B1D-1AF3-C791-9BBC-EE33CC7A0A6F",
        surl: "https://roblox-api.arkoselabs.com",
        data: {
              "blob": fieldData[1],
        },
        headers: {
            "User-Agent": USER_AGENT,
        },
        site: "https://www.roblox.com",
      })
      embedurl = `https://roblox-api.arkoselabs.com/fc/gc/?token=${token["token"]}`
      captchaId = fieldData[0]
      bol = fieldData
      let session = new funcaptcha.Session(token, {
        userAgent: USER_AGENT,
      })
      let challenge = await session.getChallenge()
      console.log({"embedUrl": session.getEmbedUrl(), captchaId: captchaId, captchaToken: token["token"]})
      
      ExpressReturn.json({"embedUrl": embedurl, captchaId: captchaId, captchaToken: token["token"]})

    }, 50);
    
        })
        
       
});




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
