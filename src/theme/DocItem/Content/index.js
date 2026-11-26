import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import Content from '@theme-original/DocItem/Content';

let playerPromise = null;

function loadPlayer() {
  if (playerPromise) {
    return playerPromise;
  }
  playerPromise = new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/vendor/asciinema/asciinema-player.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = '/vendor/asciinema/asciinema-player.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return playerPromise;
}

function mountPlayer(el) {
  if (el.hasAttribute('data-cast-ready')) {
    return;
  }
  el.setAttribute('data-cast-ready', '');
  loadPlayer()
    .then(() => {
      if (!el.isConnected) {
        return;
      }
      window.AsciinemaPlayer.create(el.getAttribute('data-src'), el, {
        rows: 28,
        fit: 'width',
        idleTimeLimit: 2,
        speed: parseFloat(el.getAttribute('data-speed') || '1'),
        preload: false,
      });
    })
    .catch((err) => {
      el.removeAttribute('data-cast-ready');
      console.error('asciinema', err);
    });
}

export default function DocItemContent(props) {
  const {pathname} = useLocation();
  useEffect(() => {
    const players = Array.from(
      document.querySelectorAll('.asciinema-cast:not([data-cast-ready])'),
    );
    if (!players.length) {
      return undefined;
    }
    if (typeof IntersectionObserver === 'undefined') {
      players.forEach(mountPlayer);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            mountPlayer(entry.target);
          }
        });
      },
      {rootMargin: '250px 0px'},
    );
    players.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return <Content {...props} />;
}
