if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const d=e=>a(e,n),r={module:{uri:n},exports:t,require:d};s[n]=Promise.all(c.map((e=>r[e]||d(e)))).then((e=>(i(...e),t)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Group 400.svg",revision:"01dcc44098bcc699e6faa71e43779174"},{url:"/_next/static/chunks/00cbbcb7-f7aa04177eb6fc99.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/07115393-0b857206f2a2b535.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/12038df7-f498eaf24562fafe.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/195-96c4645522fb097e.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/2582-cff581f72424ceaa.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/2920-6cbddf1a2fafa728.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/39209d7c-34ecc20f585a3154.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/39aecf79-c307e12803743941.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/4598-2ff2c932283e3f38.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/48507feb-47db8f5f852d64e0.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/4f9d9cd8-2f2018296c256814.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/5468-c1dbe334edd07ddb.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/5789-9542338c1df60f55.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/5816-010afed939e15e35.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/6271-d58ac59dc4899ad3.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/6373-5e8198829446d021.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/6464-a9ce359979a044d7.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/6843-b1a4252449a09095.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/8980-fdab5317432fe083.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/9081a741-739b49b4ef153560.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/93854f56-5995e4d7a14fd148.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/9632-14df45a82d9e0f92.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(auth)/login/page-ed86a4d84c4f2b80.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/duty/page-0eb056ef5e7ccc70.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/layout-da253b79ebccc3c1.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/list/page-989c408849a5aa90.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/live-video-requests/page-673cafa3dd1296a6.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/location/page-85bba618f66c3ca2.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/players/page-4d277d003db5cdce.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/playlist/page-5f9b646ac91a9dcc.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/settings/page-d27cabcfcdd1b53d.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(dashboard)/songs/page-22da22cc27eda5a9.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(views)/live-stream/page-5745361a684ec430.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(views)/player-view/page-93775e96bd20936b.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(views)/table-view/page-b24972e87f24c876.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/(views)/wall-view/page-71869ad7bc676466.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/_not-found-39d5ae701a5cda34.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/add-song/page-b334d53b1aec51df.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/error-cfa51f95fdc47154.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/jumbotron/page-ebf9c3239a32965e.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/layout-d227dbf17eebae25.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/loading-fd09a310eaf9c4cb.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/app/page-5ec8b2ce9a47121f.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/b714f034-3b34dce855920413.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/bc9c3264-e57e41aa9e91664b.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/c16f53c3-124eb064b28793e7.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/ca377847-ab9d39b7d0ec903c.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/e37a0b60-d0d6c05995c1b946.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/ec3863c0-2a9a6d124990d920.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/fd9d1056-51810d8789e921e3.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/main-20cf8c83ab248c0d.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/main-app-bc46e30318144fa6.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/pages/_app-57bdff7978360b1c.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/pages/_error-29037c284dd0eec6.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-ecf4bb1969deb93a.js",revision:"qL4x_DjNIEdA_cq5wMda_"},{url:"/_next/static/css/04332bed1b01077f.css",revision:"04332bed1b01077f"},{url:"/_next/static/css/2532d1c0e3171c07.css",revision:"2532d1c0e3171c07"},{url:"/_next/static/css/c4f080c1be7f6a07.css",revision:"c4f080c1be7f6a07"},{url:"/_next/static/css/d149ecd3e816460e.css",revision:"d149ecd3e816460e"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/qL4x_DjNIEdA_cq5wMda_/_buildManifest.js",revision:"2b54d7db375d2b4c0e6af318090bebea"},{url:"/_next/static/qL4x_DjNIEdA_cq5wMda_/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/apple-icon.png",revision:"5394190b08b51f5909c9624af850cbb6"},{url:"/assets/logo.png",revision:"ca1effdf8499700b9ed03ae25812ea45"},{url:"/change-pass.svg",revision:"55f583d2d309bde73ef709741d849691"},{url:"/clear-song.svg",revision:"e2cd50bf15cec0c9d21eb0dadb755949"},{url:"/dashboard.svg",revision:"d3c4f3a2305287763366c793ab35c836"},{url:"/duty-icon.svg",revision:"91366694ed6b006fdeafff6894244c59"},{url:"/duty.svg",revision:"ad41a6a407e817fddd0b29ccb2096ad5"},{url:"/fav-song.svg",revision:"b23ad8f4a65bc2a37dda562ae6904951"},{url:"/fonts/icomoon.eot",revision:"db6eca6452846c16bfbfbd812a2df9cc"},{url:"/fonts/icomoon.svg",revision:"008332e001e03b25927f200510feb411"},{url:"/fonts/icomoon.ttf",revision:"534ee06d39703313fdbeb1a0077d5923"},{url:"/fonts/icomoon.woff",revision:"beb029fa8a857928c31684df9632b706"},{url:"/icon-192x192.png",revision:"5394190b08b51f5909c9624af850cbb6"},{url:"/icon-256x256.png",revision:"e1acd4906a0da40562cb3b86302b7d89"},{url:"/icon-384x384.png",revision:"e1f1acd8f1f05868d6c355d4f1bdc7a9"},{url:"/icon-512x512.png",revision:"00a5ec77de547482aea54f90ad2f792a"},{url:"/logo.svg",revision:"84c9dcff2d53a60120b9f67dbac51eb2"},{url:"/manifest.json",revision:"a94a35c5535b449ea434de05ce098d3f"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/player-logo.svg",revision:"f1d1dc634cf05d12d645c25589e0a7ae"},{url:"/players.svg",revision:"50c8828bd376c290ba884259e57e86bf"},{url:"/playlist.svg",revision:"221f5476a32b29b282660b0390655486"},{url:"/reports.svg",revision:"ce10b14ebe92c3b3cec27587ea696fe8"},{url:"/setting.svg",revision:"9c15b33063a80c3717ab794f4ede5601"},{url:"/song.svg",revision:"1982e3a5952e48f9e85d482bb80144b8"},{url:"/songs.svg",revision:"0c066ca8ff196fa39b36d11266c803f8"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"},{url:"/thePlaylistLogo.svg",revision:"f4388b39234a7dbfa725d47acedc0091"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
