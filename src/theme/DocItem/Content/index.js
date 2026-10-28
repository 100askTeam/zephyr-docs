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

function initPlayers() {
  const players = document.querySelectorAll('.asciinema-cast:not([data-cast-ready])');
  if (!players.length) {
    return;
  }
  players.forEach((el) => el.setAttribute('data-cast-ready', ''));
  loadPlayer()
    .then(() => {
      players.forEach((el) => {
        window.AsciinemaPlayer.create(el.getAttribute('data-src'), el, {
          rows: 28,
          fit: 'width',
          idleTimeLimit: 2,
          speed: parseFloat(el.getAttribute('data-speed') || '1'),
          preload: true,
        });
      });
    })
    .catch((err) => {
      console.error('asciinema', err);
    });
}

export default function DocItemContent(props) {
  const {pathname} = useLocation();
  useEffect(() => {
    initPlayers();
  }, [pathname]);
  return <Content {...props} />;
}
