<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sm xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="de">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Zofingen Treuhand — Sitemap</title>
        <style>
          :root {
            --blue: #012068;
            --blue2: #0a3a8a;
            --card: #f4f7fb;
            --line: #d7e0ee;
            --muted: #5a6b85;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            color: var(--blue);
            background: linear-gradient(180deg, #eef3f9 0%, #ffffff 220px);
          }
          .wrap { max-width: 960px; margin: 0 auto; padding: 40px 20px 64px; }
          h1 { font-size: 28px; margin: 0 0 8px; }
          .lead { color: var(--muted); margin: 0 0 28px; font-size: 15px; line-height: 1.5; }
          .meta {
            display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;
          }
          .chip {
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: 999px;
            padding: 6px 12px;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 12px;
            overflow: hidden;
          }
          th, td {
            text-align: left;
            padding: 12px 14px;
            border-bottom: 1px solid var(--line);
            vertical-align: top;
            font-size: 14px;
          }
          th {
            background: var(--blue);
            color: #fff;
            font-weight: 700;
          }
          tr:last-child td { border-bottom: 0; }
          tr:nth-child(even) td { background: #fafcfe; }
          a { color: var(--blue2); text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .note {
            margin-top: 18px;
            color: var(--muted);
            font-size: 13px;
            line-height: 1.45;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <xsl:choose>
            <xsl:when test="sm:sitemapindex">
              <h1>Sitemap index</h1>
              <p class="lead">Übersicht der Sitemap-Dateien für Google und andere Suchmaschinen.</p>
              <div class="meta">
                <div class="chip">
                  <xsl:value-of select="count(sm:sitemapindex/sm:sitemap)"/> Dateien
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>Sitemap</th><th>Zuletzt geändert</th></tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sm:sitemapindex/sm:sitemap">
                    <tr>
                      <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                      <td><xsl:value-of select="sm:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <h1>URL-Liste</h1>
              <p class="lead">Alle indexierbaren Seiten dieses Sitemaps (en + de).</p>
              <div class="meta">
                <div class="chip">
                  <xsl:value-of select="count(sm:urlset/sm:url)"/> URLs
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>URL</th><th>Zuletzt geändert</th></tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sm:urlset/sm:url">
                    <tr>
                      <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                      <td><xsl:value-of select="sm:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:otherwise>
          </xsl:choose>
          <p class="note">
            Dieses Stylesheet ist nur für die Browser-Ansicht. Suchmaschinen lesen weiterhin das rohe XML.
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
