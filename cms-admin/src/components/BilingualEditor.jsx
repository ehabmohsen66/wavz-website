export default function BilingualEditor({
  label,
  namePrefix = '',
  valueEn = '',
  valueAr = '',
  onChange,
  type = 'input',
  rows = 4,
  placeholder,
  required = false,
}) {
  const handleChange = (lang, value) => {
    onChange({ [`${namePrefix}_en`]: lang === 'en' ? value : valueEn, [`${namePrefix}_ar`]: lang === 'ar' ? value : valueAr });
  };

  const renderField = (lang, value, dir, font) => {
    const fieldProps = {
      value: value || '',
      onChange: e => handleChange(lang, e.target.value),
      dir,
      style: { fontFamily: font },
      placeholder: placeholder || `Enter ${lang === 'en' ? 'English' : 'Arabic'} text...`,
      required: required && lang === 'en',
    };

    if (type === 'textarea' || type === 'rich') {
      return (
        <textarea
          {...fieldProps}
          className="form-textarea"
          rows={type === 'rich' ? rows + 4 : rows}
        />
      );
    }
    return <input {...fieldProps} type="text" className="form-input" />;
  };

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="bilingual-editor">
        <div className="bilingual-panel">
          <div className="bilingual-panel-label">
            <span className="lang-tag lang-en">EN</span> English
          </div>
          {renderField('en', valueEn, 'ltr', "'Inter', sans-serif")}
          <div className="char-count">{(valueEn || '').length} chars</div>
        </div>
        <div className="bilingual-panel">
          <div className="bilingual-panel-label">
            <span className="lang-tag lang-ar">AR</span> العربية
          </div>
          {renderField('ar', valueAr, 'rtl', "'Tajawal', sans-serif")}
          <div className="char-count">{(valueAr || '').length} chars</div>
        </div>
      </div>
    </div>
  );
}
