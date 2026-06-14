'use client';

import { CircularProgress } from '@officina/ui';

export function CircularProgressDemo() {
  return (
    <>
      <CircularProgress value={25} label="25%" />
      <CircularProgress value={50} label="50%" />
      <CircularProgress value={75} label="75%" />
      <CircularProgress value={100} label="Done" />
    </>
  );
}
