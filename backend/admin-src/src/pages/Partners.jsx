import React from 'react';
import CrudPage, { Field, Input, Select } from '../components/CrudPage.jsx';
import { api } from '../api.js';

const TIERS = [{value:'strategic',label:'Strategic'},{value:'gold',label:'Gold'},{value:'silver',label:'Silver'},{value:'standard',label:'Standard'}];

const COLS = [
  { key:'logo', label:'Logo', render: v => v ? <img src={v} alt="" style={{width:48,height:28,objectFit:'contain',background:'white',borderRadius:4,padding:4}} /> : <div style={{width:48,height:28,background:'var(--border)',borderRadius:4}} /> },
  { key:'name_en', label:'Name' },
  { key:'tier', label:'Tier', render: v => <span style={{padding:'2px 8px',borderRadius:20,background:'rgba(255,184,20,0.15)',color:'var(--gold)',fontSize:12,textTransform:'capitalize'}}>{v}</span> },
  { key:'website', label:'Website', render: v => v ? <a href={v} target="_blank" rel="noopener" style={{color:'var(--blueL)',fontSize:12}}>Visit ↗</a> : '—' },
  { key:'is_active', label:'Active', render: v => <span style={{color:v?'var(--success)':'var(--muted)'}}>{v?'Yes':'No'}</span> },
  { key:'sort_order', label:'Order' },
];

const EMPTY = { name_en:'', name_ar:'', logo:'', website:'', tier:'standard', description_en:'', description_ar:'', sort_order:0, is_active:true };

function PartnersForm(form, onChange) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Field label="Name (English)"><Input value={form.name_en} onChange={v=>onChange('name_en',v)} placeholder="Partner Name" /></Field>
        <Field label="Name (Arabic)"><Input value={form.name_ar} onChange={v=>onChange('name_ar',v)} /></Field>
        <Field label="Logo URL"><Input value={form.logo} onChange={v=>onChange('logo',v)} placeholder="https://..." /></Field>
        <Field label="Website"><Input value={form.website} onChange={v=>onChange('website',v)} placeholder="https://..." /></Field>
        <Field label="Tier"><Select value={form.tier} onChange={v=>onChange('tier',v)} options={TIERS} /></Field>
        <Field label="Sort Order"><Input type="number" value={form.sort_order} onChange={v=>onChange('sort_order',Number(v))} /></Field>
      </div>
      <Field label="Active">
        <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
          <input type="checkbox" checked={!!form.is_active} onChange={e=>onChange('is_active',e.target.checked)} />
          <span style={{fontSize:13.5,color:'var(--white)'}}>Visible on website</span>
        </label>
      </Field>
    </>
  );
}

export default function Partners() {
  return (
    <CrudPage
      title="Partners"
      subtitle="Manage partner logos and tier levels"
      fetchFn={api.getPartners}
      columns={COLS}
      renderForm={PartnersForm}
      createFn={api.createPartner}
      updateFn={api.updatePartner}
      deleteFn={api.deletePartner}
      emptyForm={EMPTY}
    />
  );
}
