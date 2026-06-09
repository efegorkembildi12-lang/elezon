/* ELEZON — Admin Catalog: Categories + Brands */

import { useState } from 'react';
import { useStore } from './store';
import {
  AdmIcon, admCatIcon, PageHead, Toolbar, SearchBox, Th, EmptyState,
  Drawer, ConfirmModal, Field, TextInput, TextArea, SelectInput,
  useToast, sortRows,
} from './shared';
import type { AdminSection, AdminCategory, AdminBrand, SortState } from './types';

interface Props {
  section: 'categories' | 'brands';
  go: (r: AdminSection, a?: string | null) => void;
  t: (s: string) => string;
}

/* ===================== CATEGORIES ===================== */

const BLANK_CAT: Omit<AdminCategory, 'id'> = { name: '', short: '', code: '', count: 0, desc: '', sub: [] };

function CatForm({
  cat, t, onSave, onClose,
}: {
  cat: AdminCategory | null;
  t: (s: string) => string;
  onSave: (d: Omit<AdminCategory, 'id'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<AdminCategory, 'id'>>(
    cat ? { name: cat.name, short: cat.short, code: cat.code, count: cat.count, desc: cat.desc, sub: cat.sub } : { ...BLANK_CAT },
  );
  const set = <K extends keyof Omit<AdminCategory, 'id'>>(k: K, v: Omit<AdminCategory, 'id'>[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Drawer
      title={cat ? t('Редактировать') : t('Новая категория')}
      eyebrow={cat ? cat.code : t('Категории')}
      onClose={onClose}
      footer={
        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>{t('Отмена')}</button>
          <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => onSave(form)}>{t('Сохранить')}</button>
        </div>
      }
    >
      <div className="col" style={{ gap: 0 }}>
        <Field label={t('Наименование')} req>
          <TextInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={t('Наименование')} />
        </Field>
        <div className="row" style={{ gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label={t('Краткое имя')}>
              <TextInput value={form.short} onChange={(e) => set('short', e.target.value)} placeholder="Клапаны" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label={t('Код')}>
              <TextInput value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="valves" />
            </Field>
          </div>
        </div>
        <Field label={t('Описание')}>
          <TextArea value={form.desc} onChange={(e) => set('desc', e.target.value)} rows={3} placeholder={t('Описание')} />
        </Field>
        <Field label={t('Подкатегории')}>
          <TextArea
            value={form.sub.join('\n')}
            onChange={(e) => set('sub', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
            rows={4}
            placeholder="Шаровые клапаны"
          />
        </Field>
      </div>
    </Drawer>
  );
}

function Categories({ t }: { t: (s: string) => string }) {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortState>({ col: 'name', dir: 'asc' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = categories.filter((c) => {
    const ql = q.toLowerCase();
    return !ql || t(c.name).toLowerCase().includes(ql) || c.code.toLowerCase().includes(ql);
  });
  const sorted = sortRows(filtered, sort, {}) as AdminCategory[];
  const editing = editId ? categories.find((c) => c.id === editId) ?? null : null;

  const handleSave = (data: Omit<AdminCategory, 'id'>) => {
    if (editId) {
      updateCategory(editId, data);
      toast(t('Категория обновлена'));
    } else {
      addCategory(data);
      toast(t('Категория добавлена'));
    }
    setDrawerOpen(false); setEditId(null);
  };
  const handleDelete = (id: string) => {
    deleteCategory(id); toast(t('Запись удалена')); setConfirmId(null);
  };

  return (
    <>
      <PageHead
        crumb={<span>{t('Категории')}</span>}
        title={t('Категории')}
        sub={t('Разделы каталога и количество позиций.')}
        actions={
          <button className="btn btn-accent btn-sm" onClick={() => { setEditId(null); setDrawerOpen(true); }}>
            <AdmIcon.plus width={16} height={16} />{t('Новая категория')}
          </button>
        }
      />
      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder={t('Поиск по панели…')} />
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--t-faint)' }}>
          {sorted.length} {t('из')} {categories.length}
        </span>
      </Toolbar>
      <div className="adm-table-wrap">
        {sorted.length === 0
          ? <EmptyState icon={AdmIcon.layers} title={t('Ничего не найдено')} body={t('Измените запрос или фильтры.')} />
          : (
            <table className="adm-table">
              <thead><tr>
                <th style={{ width: 42 }} />
                <Th label={t('Наименование')} col="name" sort={sort} setSort={setSort} />
                <Th label={t('Код')} col="code" sort={sort} setSort={setSort} />
                <Th label={t('Позиций')} col="count" sort={sort} setSort={setSort} />
                <th>{t('Подкатегории')}</th>
                <th style={{ width: 90 }}>{t('Действия')}</th>
              </tr></thead>
              <tbody>
                {sorted.map((c) => {
                  const Icon = admCatIcon[c.id] ?? AdmIcon.layers;
                  return (
                    <tr key={c.id}>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ display: 'inline-flex', width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                          <Icon width={18} height={18} />
                        </span>
                      </td>
                      <td>
                        <span className="adm-td-strong">{t(c.name)}</span>
                        {c.short && <div className="adm-td-sub">{t(c.short)}</div>}
                      </td>
                      <td><span className="num" style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--t-muted)' }}>{c.code}</span></td>
                      <td className="num" style={{ fontWeight: 700 }}>{c.count}</td>
                      <td style={{ color: 'var(--t-faint)', fontSize: 13 }}>
                        {c.sub.slice(0, 3).join(' · ')}{c.sub.length > 3 ? ` +${c.sub.length - 3}` : ''}
                      </td>
                      <td>
                        <div className="adm-row-actions">
                          <button className="adm-mini-btn" title={t('Редактировать')} onClick={() => { setEditId(c.id); setDrawerOpen(true); }}>
                            <AdmIcon.edit width={14} height={14} />
                          </button>
                          <button className="adm-mini-btn danger" title={t('Удалить')} onClick={() => setConfirmId(c.id)}>
                            <AdmIcon.trash width={14} height={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>
      {drawerOpen && (
        <CatForm cat={editing} t={t} onSave={handleSave} onClose={() => { setDrawerOpen(false); setEditId(null); }} />
      )}
      {confirmId && (
        <ConfirmModal title={t('Точно удалить?')} body={t('Это действие нельзя отменить.')} confirmLabel={t('Да, удалить')}
          onConfirm={() => handleDelete(confirmId)} onClose={() => setConfirmId(null)} t={t} />
      )}
    </>
  );
}

/* ===================== BRANDS ===================== */

const BLANK_BRAND: Omit<AdminBrand, 'id'> = { name: '', country: '', slug: '', count: 0 };

function BrandForm({
  brand, t, onSave, onClose,
}: {
  brand: AdminBrand | null;
  t: (s: string) => string;
  onSave: (d: Omit<AdminBrand, 'id'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<AdminBrand, 'id'>>(
    brand ? { name: brand.name, country: brand.country, slug: brand.slug, count: brand.count } : { ...BLANK_BRAND },
  );
  const set = <K extends keyof Omit<AdminBrand, 'id'>>(k: K, v: Omit<AdminBrand, 'id'>[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Drawer
      title={brand ? t('Редактировать') : t('Новый бренд')}
      eyebrow={brand ? brand.slug : t('Бренды')}
      onClose={onClose}
      footer={
        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>{t('Отмена')}</button>
          <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => onSave(form)}>{t('Сохранить')}</button>
        </div>
      }
    >
      <div className="col" style={{ gap: 0 }}>
        <Field label={t('Бренд')} req>
          <TextInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Danfoss" />
        </Field>
        <div className="row" style={{ gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label={t('Страна')}>
              <SelectInput value={form.country} onChange={(e) => set('country', e.target.value)}>
                <option value="">—</option>
                <option value="Германия">{t('Германия')}</option>
                <option value="Швейцария">{t('Швейцария')}</option>
                <option value="Франция">{t('Франция')}</option>
                <option value="Италия">{t('Италия')}</option>
                <option value="Швеция">{t('Швеция')}</option>
                <option value="Германия / Швейцария">{t('Германия / Швейцария')}</option>
              </SelectInput>
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Slug">
              <TextInput value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="danfoss" />
            </Field>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function Brands({ t }: { t: (s: string) => string }) {
  const { brands, addBrand, updateBrand, deleteBrand } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortState>({ col: 'name', dir: 'asc' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = brands.filter((b) => {
    const ql = q.toLowerCase();
    return !ql || b.name.toLowerCase().includes(ql) || t(b.country).toLowerCase().includes(ql);
  });
  const sorted = sortRows(filtered, sort, {}) as AdminBrand[];
  const editing = editId ? brands.find((b) => b.id === editId) ?? null : null;

  const handleSave = (data: Omit<AdminBrand, 'id'>) => {
    if (editId) {
      updateBrand(editId, data);
      toast(t('Бренд обновлён'));
    } else {
      addBrand(data);
      toast(t('Бренд добавлен'));
    }
    setDrawerOpen(false); setEditId(null);
  };
  const handleDelete = (id: string) => {
    deleteBrand(id); toast(t('Запись удалена')); setConfirmId(null);
  };

  return (
    <>
      <PageHead
        crumb={<span>{t('Бренды')}</span>}
        title={t('Бренды')}
        sub={t('Производители и бренды каталога.')}
        actions={
          <button className="btn btn-accent btn-sm" onClick={() => { setEditId(null); setDrawerOpen(true); }}>
            <AdmIcon.plus width={16} height={16} />{t('Новый бренд')}
          </button>
        }
      />
      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder={t('Поиск по панели…')} />
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--t-faint)' }}>
          {sorted.length} {t('из')} {brands.length}
        </span>
      </Toolbar>
      <div className="adm-table-wrap">
        {sorted.length === 0
          ? <EmptyState icon={AdmIcon.tag} title={t('Ничего не найдено')} body={t('Измените запрос или фильтры.')} />
          : (
            <table className="adm-table">
              <thead><tr>
                <Th label={t('Бренд')} col="name" sort={sort} setSort={setSort} />
                <Th label={t('Страна')} col="country" sort={sort} setSort={setSort} />
                <Th label={t('Позиций')} col="count" sort={sort} setSort={setSort} />
                <th style={{ width: 90 }}>{t('Действия')}</th>
              </tr></thead>
              <tbody>
                {sorted.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="adm-td-strong">{b.name}</span>
                      <div className="adm-td-sub">{b.slug}</div>
                    </td>
                    <td>{t(b.country)}</td>
                    <td className="num" style={{ fontWeight: 700 }}>{b.count}</td>
                    <td>
                      <div className="adm-row-actions">
                        <button className="adm-mini-btn" title={t('Редактировать')} onClick={() => { setEditId(b.id); setDrawerOpen(true); }}>
                          <AdmIcon.edit width={14} height={14} />
                        </button>
                        <button className="adm-mini-btn danger" title={t('Удалить')} onClick={() => setConfirmId(b.id)}>
                          <AdmIcon.trash width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
      {drawerOpen && (
        <BrandForm brand={editing} t={t} onSave={handleSave} onClose={() => { setDrawerOpen(false); setEditId(null); }} />
      )}
      {confirmId && (
        <ConfirmModal title={t('Точно удалить?')} body={t('Это действие нельзя отменить.')} confirmLabel={t('Да, удалить')}
          onConfirm={() => handleDelete(confirmId)} onClose={() => setConfirmId(null)} t={t} />
      )}
    </>
  );
}

/* ===================== EXPORT ===================== */

export default function Catalog({ section, go: _go, t }: Props) {
  return (
    <div className="rise">
      {section === 'categories' ? <Categories t={t} /> : <Brands t={t} />}
    </div>
  );
}
