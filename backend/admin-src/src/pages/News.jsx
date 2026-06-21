import React from 'react';
import CrudPage, { Field, Input, Textarea, Select } from '../components/CrudPage.jsx';
import { api } from '../api.js';

const CATS = [{value:'press-releases',label:'Press Releases'},{value:'events',label:'Events'},{value:'insights',label:'Insights'},{value:'client-stories',label:'Client Stories'},{value:'social',label:'Social'}];

const COLS = [
  { key:'image', label:'Image', render: v => v ? <img src={v} alt="" style={{width:48,height:32,objectFit:'cover',borderRadius:4}} /> : <div style={{width:48,height:32,background:'var(--border)',borderRadius:4}} /> },
  { key:'title_en', label:'Title', render: v => <span style={{maxWidth:260,display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span> },
  { key:'category', label:'Category', render: v => <span style={{padding:'2px 8px',borderRadius:20,background:'rgba(17,115,189,0.15)',color:'var(--blueL)',fontSize:12}}>{v}</span> },
  { key:'published', label:'Status', render: v => <span style={{color:v?'var(--success)':'var(--warning)'}}>{v?'Live':'Draft'}</span> },
  { key:'published_at', label:'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
];

const EMPTY = { title_en:'', title_ar:'', summary_en:'', summary_ar:'', body_en:'', body_ar:'', image:'', category:'press-releases', source_url:'', published:true };

function NewsForm(form, onChange) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Title (English)"><Input value={form.title_en} onChange={v=>onChange('title_en',v)} /></Field>
        <Field label="Title (Arabic)"><Input value={form.title_ar} onChange={v=>onChange('title_ar',v)} /></Field>
        <Field label="Category"><Select value={form.category} onChange={v=>onChange('category',v)} options={CATS} /></Field>
        <Field label="Image URL"><Input value={form.image} onChange={v=>onChange('image',v)} placeholder="https://..." /></Field>
      </div>
      <Field label="Summary (English)"><Textarea value={form.summary_en} onChange={v=>onChange('summary_en',v)} rows={2} /></Field>
      <Field label="Summary (Arabic)"><Textarea value={form.summary_ar} onChange={v=>onChange('summary_ar',v)} rows={2} /></Field>
      <Field label="Body (English)"><Textarea value={form.body_en} onChange={v=>onChange('body_en',v)} rows={5} /></Field>
      <Field label="Body (Arabic)"><Textarea value={form.body_ar} onChange={v=>onChange('body_ar',v)} rows={5} /></Field>
      <Field label="Source URL (optional)"><Input value={form.source_url} onChange={v=>onChange('source_url',v)} placeholder="https://..." /></Field>
      <Field label="Status">
        <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
          <input type="checkbox" checked={!!form.published} onChange={e=>onChange('published',e.target.checked)} />
          <span style={{fontSize:13.5,color:'var(--white)'}}>Published</span>
        </label>
      </Field>
    </>
  );
}

export default function News() {
  return (
    <CrudPage
      title="News & Media"
      subtitle="Press releases, events, insights, and client stories"
      fetchFn={api.getNews}
      columns={COLS}
      renderForm={NewsForm}
      createFn={api.createNews}
      updateFn={api.updateNews}
      deleteFn={api.deleteNews}
      emptyForm={EMPTY}
    />
  );
}
