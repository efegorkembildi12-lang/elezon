/* ELEZON — navigation helper mirroring the prototype's go(route, arg) API,
   backed by react-router. Keeps page components close to the original mockup. */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category, Product } from '../types';

export type GoArg = Category | Product | null;
export type Go = (route: string, arg?: GoArg) => void;

/** Pure route-name → path mapping. Single source of truth, also used to build
    real `<a href>`/`<Link to>` targets for crawlable internal links. */
export function routePath(route: string, arg?: GoArg): string {
  switch (route) {
    case 'home': return '/';
    case 'catalog': return '/catalog';
    case 'category': return `/catalog/${(arg as Category).id}`;
    case 'product': return `/product/${(arg as Product).id}`;
    case 'company': return '/company';
    case 'delivery': return '/delivery';
    case 'contacts': return '/contacts';
    case 'request': return '/request';
    case 'faq': return '/faq';
    case 'legal': return '/legal';
    case 'privacy': return '/legal#privacy';
    case 'terms': return '/legal#terms';
    case 'cookies': return '/legal#cookies';
    case 'consent': return '/legal#consent';
    default: return '/';
  }
}

export function useGo(): Go {
  const navigate = useNavigate();
  return useCallback<Go>((route, arg) => navigate(routePath(route, arg)), [navigate]);
}
