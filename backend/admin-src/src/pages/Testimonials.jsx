import React from 'react';
import CrudPage, { Field, Input, Textarea, Select } from '../components/CrudPage.jsx';
import { api } from '../api.js';

const TYPES = [{value:'client',label:'Client'},{value:'partner',label:'Partner'}];

const COLS = [
  { key:'photo', label:'Photo', render: v => v ? <img src={v.startsWith('http')?v:`http://localhost:3001${v}`} alt="" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover'}} /> : <div style={{width:36,height:36,borderRadius:'50%',background:'var(--border)',display:'flex',alignItems:'center',justifyContent:'center'}}>⭐</div> },
  { key:'name_en', label:'Name' },
  { key:'role_en', label:'Role' },
  { key:'company', label:'Company' },
  { key:'type', label:'Type', render: v => <span style={{padding:'2px 8px',borderRadius:20,background:'rgba(17,115,189,0.15)',color:'var(--blueL)',fontSize:12,textTransform:'capitalize'}}>{v}</span> },
  { key:'is_active', label:'Active', render: v => <span style={{color:v?'var(--success)':'var(--muted)'}}>{v?'Yes':'No'}</span> },
];

const EMPTY = { name_en:'', name_ar:'', role_en:'', role_ar:'', company:'', quote_en:'', quote_ar:'', photo:'', type:'client', sort_order:0, is_active:true };

function TestimonialsForm(form, onChange) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Name (English)"><Input value={form.name_en} onChange={v=>onChange('name_en',v)} /></Field>
        <Field label="Name (Arabic)"><Input value={form.name_ar} onChange={v=>onChange('name_ar',v)} /></Field>
        <Field label="Role (English)"><Input value={form.role_en} onChange={v=>onChange('role_en',v)} placeholder="CEO" /></Field>
        <Field label="Role (Arabic)"><Input value={form.role_ar} onChange={v=>onChange('role_ar',v)} /></Field>
        <Field label="Company"><Input value={form.company} onChange={v=>onChange('company',v)} /></Field>
        <Field label="Type"><Select value={form.type} onChange={v=>onChange('type',v)} options={TYPES} /></Field>
        <Field label="Photo URL"><Input value={form.photo} onChange={v=>onChange('photo',v)} placeholder="https://..." /></Field>
        <Field label="Sort Order"><Input type="number" value={form.sort_order} onChange={v=>onChange('sort_order',Number(v))} /></Field>
      </div>
      <Field label="Quote (English)"><Textarea value={form.quote_en} onChange={v=>onChange('quote_en',v)} rows={3} /></Field>
      <Field label="Quote (Arabic)"><Textarea value={form.quote_ar} onChange={v=>onChange('quote_ar',v)} rows={3} /></Field>
    </>
  );
}

export default function Testimonials() {
  return (
    <CrudPage
      title="Testimonials"
      subtitle="Client and partner quotes"
      fetchFn={api.getTestimonials}
      columns={COLS}
      renderForm={TestimonialsForm}
      createFn={api.createTestimonial}
      updateFn={api.updateTestimonial}
      deleteFn={api.deleteTestimonial}
      emptyForm={EMPTY}
    />
  );
}
