if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + ".js", a).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, t) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let c = {};
    const r = (e) => n(e, i),
      d = { module: { uri: i }, exports: c, require: r };
    s[i] = Promise.all(a.map((e) => d[e] || r(e))).then((e) => (t(...e), c));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/Group 400.svg", revision: "01dcc44098bcc699e6faa71e43779174" },
        {
          url: "/_next/static/YVCm6kuHW7A2NnEvtPCbd/_buildManifest.js",
          revision: "2b54d7db375d2b4c0e6af318090bebea",
        },
        {
          url: "/_next/static/YVCm6kuHW7A2NnEvtPCbd/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/00cbbcb7-f7aa04177eb6fc99.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/07115393-0b857206f2a2b535.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/12038df7-f498eaf24562fafe.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/195-8d6b93ed51ac7f8a.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/2582-1f3a2537ac292509.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/3902-6f45032bbccf587f.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/39209d7c-34ecc20f585a3154.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/39aecf79-c307e12803743941.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/48507feb-47db8f5f852d64e0.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/4874-903de6be2edc133e.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/4f9d9cd8-2f2018296c256814.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/5079-dd502a2d1cd1ee6b.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/5468-7514d9c51dfbbf2a.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/5789-9542338c1df60f55.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/5952.f3d56a56bb0969ff.js",
          revision: "f3d56a56bb0969ff",
        },
        {
          url: "/_next/static/chunks/6044-14443678de0179df.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/6464-a1447549fb665a01.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/6843-eeee64cef9a8fcf1.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/8980-5730bbd29e17d669.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/9081a741-739b49b4ef153560.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/93854f56-5995e4d7a14fd148.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(auth)/login/page-050758073c048f4e.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/duty/page-3b5c4b04a4b2ef24.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/layout-d4b41c5870a4def1.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/list/page-b4dfbc272897a0ee.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/live-video-requests/page-526e1a2f199b26b4.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/players/page-4de76c189d3878f4.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/playlist/page-e7b9804447629dab.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/settings/page-6f79a8bf40e20ca8.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/songs/page-bbce48969439bfb0.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(views)/live-stream/page-bdb1b9432bf25b2f.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(views)/player-view/page-31cfdb9bcea1cb31.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(views)/table-view/page-bf05be979f651e9d.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/(views)/wall-view/page-09d74366869205ca.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/_not-found-3da63bf8b4fbba62.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/add-song/page-fde59102af6c8d1e.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/error-2a5cdba5f8bbe22c.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/jumbotron/page-e302e01099f222ea.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/layout-c2096c9ccb000f8d.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/loading-fd09a310eaf9c4cb.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/app/page-5ec8b2ce9a47121f.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/b714f034-b618bedce37bb4c9.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/bc9c3264-e57e41aa9e91664b.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/c16f53c3-71ecd6db9b27c8ba.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/ca377847.b8e30fab3053629a.js",
          revision: "b8e30fab3053629a",
        },
        {
          url: "/_next/static/chunks/e37a0b60-d0d6c05995c1b946.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/ec3863c0-2a9a6d124990d920.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/fd9d1056-75dfd44ed67229f8.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/framework-8e0e0f4a6b83a956.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/main-app-31291df606d62a1d.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/main-bebceb3ce0d6b569.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/pages/_app-57bdff7978360b1c.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/pages/_error-29037c284dd0eec6.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-5a0fa4272f97be93.js",
          revision: "YVCm6kuHW7A2NnEvtPCbd",
        },
        {
          url: "/_next/static/css/c4f080c1be7f6a07.css",
          revision: "c4f080c1be7f6a07",
        },
        {
          url: "/_next/static/css/d149ecd3e816460e.css",
          revision: "d149ecd3e816460e",
        },
        {
          url: "/_next/static/css/e8c4ea2669619a06.css",
          revision: "e8c4ea2669619a06",
        },
        {
          url: "/_next/static/css/efb9c7e6b88fc041.css",
          revision: "efb9c7e6b88fc041",
        },
        {
          url: "/_next/static/media/26a46d62cd723877-s.woff2",
          revision: "befd9c0fdfa3d8a645d5f95717ed6420",
        },
        {
          url: "/_next/static/media/55c55f0601d81cf3-s.woff2",
          revision: "43828e14271c77b87e3ed582dbff9f74",
        },
        {
          url: "/_next/static/media/581909926a08bbc8-s.woff2",
          revision: "f0b86e7c24f455280b8df606b89af891",
        },
        {
          url: "/_next/static/media/6d93bde91c0c2823-s.woff2",
          revision: "621a07228c8ccbfd647918f1021b4868",
        },
        {
          url: "/_next/static/media/97e0cb1ae144a2a9-s.woff2",
          revision: "e360c61c5bd8d90639fd4503c829c2dc",
        },
        {
          url: "/_next/static/media/a34f9d1faa5f3315-s.p.woff2",
          revision: "d4fe31e6a2aebc06b8d6e558c9141119",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/apple-icon.png",
          revision: "5394190b08b51f5909c9624af850cbb6",
        },
        {
          url: "/assets/logo.png",
          revision: "ca1effdf8499700b9ed03ae25812ea45",
        },
        {
          url: "/change-pass.svg",
          revision: "55f583d2d309bde73ef709741d849691",
        },
        {
          url: "/clear-song.svg",
          revision: "e2cd50bf15cec0c9d21eb0dadb755949",
        },
        { url: "/dashboard.svg", revision: "d3c4f3a2305287763366c793ab35c836" },
        { url: "/duty-icon.svg", revision: "91366694ed6b006fdeafff6894244c59" },
        { url: "/duty.svg", revision: "ad41a6a407e817fddd0b29ccb2096ad5" },
        { url: "/fav-song.svg", revision: "b23ad8f4a65bc2a37dda562ae6904951" },
        {
          url: "/fonts/icomoon.eot",
          revision: "db6eca6452846c16bfbfbd812a2df9cc",
        },
        {
          url: "/fonts/icomoon.svg",
          revision: "008332e001e03b25927f200510feb411",
        },
        {
          url: "/fonts/icomoon.ttf",
          revision: "534ee06d39703313fdbeb1a0077d5923",
        },
        {
          url: "/fonts/icomoon.woff",
          revision: "beb029fa8a857928c31684df9632b706",
        },
        {
          url: "/icon-192x192.png",
          revision: "5394190b08b51f5909c9624af850cbb6",
        },
        {
          url: "/icon-256x256.png",
          revision: "e1acd4906a0da40562cb3b86302b7d89",
        },
        {
          url: "/icon-384x384.png",
          revision: "e1f1acd8f1f05868d6c355d4f1bdc7a9",
        },
        {
          url: "/icon-512x512.png",
          revision: "00a5ec77de547482aea54f90ad2f792a",
        },
        { url: "/logo.svg", revision: "84c9dcff2d53a60120b9f67dbac51eb2" },
        { url: "/manifest.json", revision: "a94a35c5535b449ea434de05ce098d3f" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/player-logo.svg",
          revision: "f1d1dc634cf05d12d645c25589e0a7ae",
        },
        { url: "/players.svg", revision: "50c8828bd376c290ba884259e57e86bf" },
        { url: "/playlist.svg", revision: "221f5476a32b29b282660b0390655486" },
        { url: "/reports.svg", revision: "ce10b14ebe92c3b3cec27587ea696fe8" },
        { url: "/setting.svg", revision: "9c15b33063a80c3717ab794f4ede5601" },
        { url: "/song.svg", revision: "1982e3a5952e48f9e85d482bb80144b8" },
        { url: "/songs.svg", revision: "0c066ca8ff196fa39b36d11266c803f8" },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "5a47d90db13bb1309b25bdf7b363570e",
        },
        {
          url: "/thePlaylistLogo.svg",
          revision: "f4388b39234a7dbfa725d47acedc0091",
        },
        { url: "/vercel.svg", revision: "61c6b19abff40ea7acd577be818f3976" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: n }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        n &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: n }) =>
        "1" === e.headers.get("RSC") && n && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});
