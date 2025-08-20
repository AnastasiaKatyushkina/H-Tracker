import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    ym: (id: number, action: string, ...args: unknown[]) => void;
  }
}

const YandexMetrika = () => {
  const location = useLocation();
  const metrikaId = import.meta.env.VITE_YANDEX_METRIKA_ID;
  const initialized = useRef(false);

  useEffect(() => {
    if (!metrikaId || initialized.current) return;
    initialized.current = true;

    const script = document.createElement('script');
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

      ym(${metrikaId}, 'init', {
        ssr:true,
        webvisor:true,
        clickmap:true,
        ecommerce:"dataLayer",
        accurateTrackBounce:true,
        trackLinks:true
      });
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <div>
        <img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute; left:-9999px;" alt="" />
      </div>
    `;
    document.body.appendChild(noscript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, [metrikaId]);

  useEffect(() => {
    if (!metrikaId) return;

    if (window.ym) {
      window.ym(Number(metrikaId), 'hit', location.pathname);
    }
  }, [location, metrikaId]);

  return null;
};

export default YandexMetrika;
