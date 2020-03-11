// @flow
import React from 'react';
import { BaseBar } from '../lib';
import BarData from '../fixtures/bar-data.json';

export default function Chart() {
  return <BaseBar data={BarData} />;
}
