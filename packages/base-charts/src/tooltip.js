// @flow
import React from 'react';
import { type DatumValue } from './input-types';

export type RowDatum = $ReadOnly<{|
  key: string,
  value: DatumValue,
|}>;
export type Row = $ReadOnly<{|
  datum: RowDatum,
  legend?: $ReadOnly<{|
    color: string,
    style: string,
    width: string,
  |}>,
|}>;
export type Props = $ReadOnly<{|
  titleRow?: Row,
  rows: $ReadOnlyArray<Row>,
|}>;

const ROW_HEIGHT = '0.75rem';

export default function Tooltip({ titleRow, rows }: Props) {
  return (
    // TODO: How to address styling in this library?
    // Would be nice to avoid a whole styling library
    // for such minimal needs, and accept styling via theme...
    <div
      style={{
        minWidth: '8rem',
        padding: `0.5rem ${ROW_HEIGHT} ${ROW_HEIGHT} ${ROW_HEIGHT}`,
        background: '#ffffff',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 2px',
      }}
    >
      {titleRow && renderTitleRow(titleRow)}
      <ul
        style={{
          margin: `${ROW_HEIGHT} 0 0 0`,
          paddingLeft: 0,
          listStyle: 'none',
        }}
      >
        {rows.map((row, i) => (
          <li key={`${row.datum.key}-${String(i)}`}>{renderRow(row)}</li>
        ))}
      </ul>
    </div>
  );
}

function renderTitleRow({ datum }: Row) {
  return (
    <div
      style={{
        width: '100%',
        height: '1.25rem',
        display: 'flex',
        justifyContent: 'center',
        padding: '3px 0',
        borderBottom: '1px solid rgba(0,0,0,0.25)',
      }}
    >
      {datum.value}
    </div>
  );
}

function renderRow({ datum, legend }: Row) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '3px 0',
      }}
    >
      <div>
        {legend && (
          <span
            style={{
              display: 'inline-block',
              width: ROW_HEIGHT,
              height: ROW_HEIGHT,
              borderRadius: '50%',
              marginRight: '0.5rem',
              backgroundColor: legend.color,
            }}
          />
        )}
        <span>{datum.key}</span>
      </div>
      <div style={{ marginLeft: '2rem' }}>
        <strong>{datum.value}</strong>
      </div>
    </div>
  );
}
