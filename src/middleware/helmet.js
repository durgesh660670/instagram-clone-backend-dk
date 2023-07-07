const helmet=function (req, res, next) {
    // Sets "X-DNS-Prefetch-Control" header to "off"
    res.setHeader('X-DNS-Prefetch-Control', 'off');
  
    // Sets "X-Frame-Options" header to "SAMEORIGIN"
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
    // Sets "Strict-Transport-Security" header to "max-age=15552000; includeSubDomains"
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  
    // Sets "X-Download-Options" header to "noopen"
    res.setHeader('X-Download-Options', 'noopen');
  
    // Sets "X-Content-Type-Options" header to "nosniff"
    res.setHeader('X-Content-Type-Options', 'nosniff');
  
    // Sets "X-XSS-Protection" header to "1; mode=block"
    res.setHeader('X-XSS-Protection', '1; mode=block');
  
    next();
  }

 module.exports =helmet;