import React from 'react';
import CrudPage, { Field, Input, Textarea } from '../components/CrudPage.jsx';
import { api } from '../api.js';

const COLS = [
  { key:'year', label:'Year', render: v => <span style={{fontWeight:700,color:'var(--gold)'}}>{v}</span> },
  { key:'title_en', label:'Title (EN)' },
  { key:'items_en', label:'Items', render: v => <span style={{color:'var(--muted)'}}>{Array.isArray(v)?v.length:0} items</span> },
  { key:'sort_order', label:'Order' },
];

const EMPTY = { year:'', title_en:'', title_ar:'', items_en:[], items_ar:[], icon:'star', sort_order:0 };

function TimelineForm(form, onChange) {
  const itemsEnStr = typeof form.items_en==='string' ? form.items_en : JSON.stringify(form.items_en||[], null, 2);
  const itemsArStr = typeof form.items_ar==='string' ? form.items_ar : JSON.stringify(form.items_ar||[], null, 2);
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Year"><Input value={form.year} onChange={v=>onChange('year',v)} placeholder="2020" /></Field>
        <Field label="Sort Order"><Input type="number" value={form.sort_order} onChange={v=>onChange('sort_order',Number(v))} /></Field>
        <Field label="Title (English)"><Input value={form.title_en} onChange={v=>onChange('title_en',v)} placeholder="Company Founded" /></Field>
        <Field label="Title (Arabic)"><Input value={form.title_ar} onChange={v=>onChange('title_ar',v)} /></Field>
      </div>
      <Field label='Items (English) — JSON array of strings'>
        <Textarea value={itemsEnStr} rows={5} onChange={v=>{try{onChange('items_en',JSON.parse(v));}catch{onChange('items_en',v);}}} placeholder='["Milestone 1", "Milestone 2"]' />
      </Field>
      <Field label='Items (Arabic) — JSON array of strings'>
        <Textarea value={itemsArStr} rows={5} onChange={v=>{try{onChange('items_ar',JSON.parse(v));}catch{onChange('items_ar',v);}}} />
      </Field>
    </>
  );
}

export default function Timeline() {
  return (
    <CrudPage
      title="Journey Timeline"
      subtitle="Company milestones and history entries"
      fetchFn={api.getTimeline}
      columns={COLS}
      renderForm={TimelineForm}
      createFn={api.createTimelineEntry}
      updateFn={api.updateTimelineEntry}
      deleteFn={api.deleteTimelineEntry}
      emptyForm={EMPTY}
    />
  );
}
