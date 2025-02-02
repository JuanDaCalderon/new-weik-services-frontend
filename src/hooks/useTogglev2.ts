import {useCallback, useState} from 'react';

export default function useTogglev2(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  const show = useCallback(() => setIsOpen(true), []);
  const hide = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  return {isOpen, toggle, show, hide};
}
