import React from 'react';
import CrudPage, { Field, Input, Textarea } from '../components/CrudPage.jsx';
import { api } from '../api.js';

const COLS = [
  { key:'photo', label:'Photo', render: v => v ? <img src={v.startsWith('http')?v:`http://localhost:3001${v}`} alt="" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover'}} /> : <div style={{width:36,height:36,borderRadius:'50%',background:'var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>👤</div> },
  { key:'name_en', label:'Name (EN)' },
  { key:'title_en', label:'Title (EN)' },
  { key:'is_active', label:'Active', render: v => <span style={{color:v?'var(--success)':'var(--muted)'}}>{v?'Yes':'No'}</span> },
  { key:'sort_order', label:'Order' },
];

const EMPTY = { name_en:'', name_ar:'', title_en:'', title_ar:'', bio_en:'', bio_ar:'', photo:'', linkedin:'', sort_order:0, is_active:true };

function TeamForm(form, onChange) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Name (English)"><Input value={form.name_en} onChange={v=>onChange('name_en',v)} placeholder="Full Name" /></Field>
        <Field label="Name (Arabic)"><Input value={form.name_ar} onChange={v=>onChange('name_ar',v)} placeholder="الاسم الكامل" /></Field>
        <Field label="Title (English)"><Input value={form.title_en} onChange={v=>onChange('title_en',v)} placeholder="CEO" /></Field>
        <Field label="Title (Arabic)"><Input value={form.title_ar} onChange={v=>onChange('title_ar',v)} placeholder="الرئيس التنفيذي" /></Field>
      </div>
      <Field label="Bio (English)"><Textarea value={form.bio_en} onChange={v=>onChange('bio_en',v)} rows={3} /></Field>
      <Field label="Bio (Arabic)"><Textarea value={form.bio_ar} onChange={v=>onChange('bio_ar',v)} rows={3} /></Field>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Photo URL"><Input value={form.photo} onChange={v=>onChange('photo',v)} placeholder="https:// or /uploads/team/..." /></Field>
        <Field label="LinkedIn URL"><Input value={form.linkedin} onChange={v=>onChange('linkedin',v)} placeholder="https://linkedin.com/in/..." /></Field>
        <Field label="Sort Order"><Input type="number" value={form.sort_order} onChange={v=>onChange('sort_order',Number(v))} /></Field>
        <Field label="Active">
          <label style={{display:'flex',alignItems:'center',gap:8,marginTop:8,cursor:'pointer'}}>
            <input type="checkbox" checked={!!form.is_active} onChange={e=>onChange('is_active',e.target.checked)} />
            <span style={{fontSize:13.5,color:'var(--white)'}}>Visible on website</span>
          </label>
        </Field>
      </div>
    </>
  );
}

export default function Team() {
  return (
    <CrudPage
      title="Team Members"
      subtitle="Manage the leadership team displayed on the Team page"
      fetchFn={api.getTeam}
      columns={COLS}
      renderForm={TeamForm}
      createFn={api.createTeamMember}
      updateFn={api.updateTeamMember}
      deleteFn={api.deleteTeamMember}
      emptyForm={EMPTY}
    />
  );
}
