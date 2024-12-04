import React from "react";
import { Helmet } from "react-helmet";

const EmbedPage = () => {
  return (
    <>
      <Helmet>
        <script>
          {`
          (function(w, d, t, h, s, n) {
            w.FlodeskObject = n;
            var fn = function() {
              (w[n].q = w[n].q || []).push(arguments);
            };
            w[n] = w[n] || fn;
            var f = d.getElementsByTagName(t)[0];
            var v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;
            var sm = d.createElement(t);
            sm.async = true;
            sm.type = 'module';
            sm.src = h + s + '.mjs' + v;
            f.parentNode.insertBefore(sm, f);
            var sn = d.createElement(t);
            sn.async = true;
            sn.noModule = true;
            sn.src = h + s + '.js' + v;
            f.parentNode.insertBefore(sn, f);
          })(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');
          `}
        </script>
        <script>
          {`
          window.fd('form', {
            formId: '674a90583b3ce205b7f44141'
          });
          `}
        </script>
      </Helmet>
      <div>
        {/* <h1>Embed Page</h1>
        <p>This is a page with the embedded Flodesk form.</p> */}
      </div>
    </>
  );
};

export default EmbedPage;