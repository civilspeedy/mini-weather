import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';

export const useScale = (original: number) => {
  const [size, setSize] = useState<number>();

  const scale: Promise<number> = invoke('scale', { original: original });

  useEffect(() => {
    const wait = async () => {
      setSize(await scale);
    };

    wait();
  }, []);

  return size;
};
