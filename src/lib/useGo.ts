/* ELEZON — navigation helper mirroring the prototype's go(route, arg) API,
   backed by react-router. Keeps page components close to the original mockup. */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Category, Product } from '../types';

export type GoArg = Category | Product | null;
export type Go = (route: string, arg?: GoArg) => void;

export function useGo(): Go {
  const navigate = useNavigate();
  return useCallback<Go>(
    (route, arg) => {
      switch (route) {
        case 'home': navigate('/'); break;
        case 'catalog': navigate('/catalog'); break;
        case 'category': navigate(`/catalog/${(arg as Category).id}`); break;
        case 'product': navigate(`/product/${(arg as Product).id}`); break;
        case 'company': navigate('/company'); break;
        case 'delivery': navigate('/delivery'); break;
        case 'contacts': navigate('/contacts'); break;
        case 'request': navigate('/request'); break;
        default: navigate('/');
      }
    },
    [navigate],
  );
}
