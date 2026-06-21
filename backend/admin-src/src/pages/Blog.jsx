import React from 'react';
import CrudPage, { Field, Input, Textarea, Select } from '../components/CrudPage.jsx';
import { api } from '../api.js';

const CATS = [
  {value:'insights',label:'Insights'},{value:'events',label:'Events'},
  {value:'press-releases',label:'Press Releases'},{value:'client-stories',label:'Client Stories'},
];

const COLS = [
  { key:'cover_image', label:'Cover', render: v => v ? <img src={v} alt="" style={{width:48,height:32,objectFit:'cover',borderRadius:4}} /> : <div style={{width:48,height:32,background:'var(--border)',borderRadius:4}} /> },
  { key:'title_en', label:'Title', render: v => <span style={{maxWidth:280,display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span> },
  { key:'category', label:'Category', render: v => <span style={{padding:'2px 8px',borderRadius:20,background:'rgba(17,115,189,0.15)',color:'var(--blueL)',fontSize:12}}>{v}</span> },
  { key:'published', label:'Status', render: v => <span style={{color:v?'var(--success)':'var(--warning)'}}>{v?'Published':'Draft'}</span> },
  { key:'published_at', label:'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
];

const EMPTY = { slug:'', title_en:'', title_ar:'', excerpt_en:'', excerpt_ar:'', cover_image:'', blocks_en:[], blocks_ar:[], category:'insights', author:'WAVZ Team', published:false };

function BlogForm(form, onChange) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Slug (URL)"><Input value={form.slug} onChange={v=>onChange('slug',v.toLowerCase().replace(/\s+/g,'-'))} placeholder="my-blog-post" /></Field>
        <Field label="Category"><Select value={form.category} onChange={v=>onChange('category',v)} options={CATS} /></Field>
        <Field label="Title (English)"><Input value={form.title_en} onChange={v=>onChange('title_en',v)} /></Field>
        <Field label="Title (Arabic)"><Input value={form.title_ar} onChange={v=>onChange('title_ar',v)} /></Field>
      </div>
      <Field label="Excerpt (English)"><Textarea value={form.excerpt_en} onChange={v=>onChange('excerpt_en',v)} rows={2} placeholder="Short summary…" /></Field>
      <Field label="Excerpt (Arabic)"><Textarea value={form.excerpt_ar} onChange={v=>onChange('excerpt_ar',v)} rows={2} /></Field>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Cover Image URL"><Input value={form.cover_image} onChange={v=>onChange('cover_image',v)} placeholder="https://..." /></Field>
        <Field label="Author"><Input value={form.author} onChange={v=>onChange('author',v)} placeholder="WAVZ Team" /></Field>
      </div>
      <Field label="Body (English — JSON blocks)">
        <Textarea value={typeof form.blocks_en==='string'?form.blocks_en:JSON.stringify(form.blocks_en||[],null,2)} onChange={v=>{try{onChange('blocks_en',JSON.parse(v));}catch{onChange('blocks_en',v);}}} rows={8} placeholder='[{"type":"paragraph","text":"..."}]' />
      </Field>
      <Field label="Body (Arabic — JSON blocks)">
        <Textarea value={typeof form.blocks_ar==='string'?form.blocks_ar:JSON.stringify(form.blocks_ar||[],null,2)} onChange={v=>{try{onChange('blocks_ar',JSON.parse(v));}catch{onChange('blocks_ar',v);}}} rows={6} />
      </Field>
      <Field label="Status">
        <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
          <input type="checkbox" checked={!!form.published} onChange={e=>onChange('published',e.target.checked)} />
          <span style={{fontSize:13.5,color:'var(--white)'}}>Published (visible on website)</span>
        </label>
      </Field>
    </>
  );
}

export default function Blog() {
  return (
    <CrudPage
      title="Blog Posts"
      subtitle="Manage blog articles and insights"
      fetchFn={api.getBlogPosts}
      columns={COLS}
      renderForm={BlogForm}
      createFn={api.createBlogPost}
      updateFn={api.updateBlogPost}
      deleteFn={api.deleteBlogPost}
      emptyForm={EMPTY}
    />
  );
}
