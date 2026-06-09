/* ELEZON — Admin Products section */

import { useState } from 'react';
import { useStore } from './store';
import {
  afmt, AdmIcon, PageHead, Toolbar, SearchBox, Th, EmptyState,
  Drawer, ConfirmModal, Field, TextInput, SelectInput,
  StockBadge, useToast,
  sortRows,
} from './shared';
import type { AdminSection, AdminProduct, SortState } from './types';

interface Props {
  go: (r: AdminSection, a?: string | null) => void;
  lang: 'ru' | 'en';
  t: (s: string) => string;
  openId?: string | null;
}

type StockFilter = 'all' | 'in' | 'order';

const BLANK: Omit<AdminProduct, 'id'> = {
  name: '', cat: '', brand: '', type: '', article: '', price: null, stock: 'in', qty: 0, specs: [],
};

function ProductForm({
  product, categories, brands, t, onSave, onClose, title,
}: {
  product: AdminProduct | null;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  t: (s: string) => string;
  onSave: (data: Omit<AdminProduct, 'id'>) => void;
  onClose: () => void;
  title: string;
}) {
  const [form, setForm] = useState<Omit<AdminProduct, 'id'>>(
    product
      ? { name: product.name, cat: product.cat, brand: product.brand, type: product.type, article: product.article, price: product.price, stock: product.stock, qty: product.qty, specs: product.specs }
      : { ...BLANK },
  );

  const set = <K extends keyof Omit<AdminProduct, 'id'>>(k: K, v: Omit<AdminProduct, 'id'>[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const addSpec = () => setForm((p) => ({ ...p, specs: [...p.specs, ['', '']] }));
  const setSpec = (i: number, j: 0 | 1, v: string) =>
    setForm((p) => ({
      ...p,
      specs: p.specs.map((s, si) => si === i ? (j === 0 ? [v, s[1]] : [s[0], v]) as [string, string] : s),
    }));
  const removeSpec = (i: number) =>
    setForm((p) => ({ ...p, specs: p.specs.filter((_, si) => si !== i) }));

  return (
    <Drawer
      title={title}
      eyebrow={product ? product.article : t('Новый товар')}
      onClose={onClose}
      width={560}
      footer={
        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>{t('Отмена')}</button>
          <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => onSave(form)}>{t('Сохранить')}</button>
        </div>
      }
    >
      <div className="col" style={{ gap: 0 }}>
        <div className="adm-form-section">{t('Основное')}</div>
        <Field label={t('Наименование')} req>
          <TextInput
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder={t('Наименование')}
          />
        </Field>
        <div className="row" style={{ gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label={t('Артикул')}>
              <TextInput value={form.article} onChange={(e) => set('article', e.target.value)} placeholder="KVR-120" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label={t('Тип')}>
              <TextInput value={form.type} onChange={(e) => set('type', e.target.value)} placeholder={t('Тип')} />
            </Field>
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label={t('Категория')}>
              <SelectInput value={form.cat} onChange={(e) => set('cat', e.target.value)}>
                <option value="">{t('Все категории')}</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{t(c.name)}</option>)}
              </SelectInput>
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label={t('Бренд')}>
              <SelectInput value={form.brand} onChange={(e) => set('brand', e.target.value)}>
                <option value="">{t('Все бренды')}</option>
                {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </SelectInput>
            </Field>
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label={t('Цена, ₽')}>
              <TextInput
                value={form.price != null ? String(form.price) : ''}
                onChange={(e) => set('price', e.target.value === '' ? null : Number(e.target.value.replace(/\D/g, '')))}
                placeholder={t('Цена по запросу')}
              />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label={t('Наличие')}>
              <SelectInput value={form.stock} onChange={(e) => set('stock', e.target.value as 'in' | 'order')}>
                <option value="in">{t('в наличии')}</option>
                <option value="order">{t('под заказ')}</option>
              </SelectInput>
            </Field>
          </div>
        </div>
        {form.stock === 'in' && (
          <Field label={t('Остаток, шт')}>
            <TextInput
              value={String(form.qty)}
              onChange={(e) => set('qty', Number(e.target.value.replace(/\D/g, '')) || 0)}
              placeholder="0"
            />
          </Field>
        )}

        <div className="adm-form-section" style={{ marginTop: 18 }}>{t('Характеристики')}</div>
        {form.specs.map((s, i) => (
          <div key={i} className="row" style={{ gap: 10, marginBottom: 8 }}>
            <TextInput value={s[0]} onChange={(e) => setSpec(i, 0, e.target.value)} placeholder={t('Параметр')} style={{ flex: 1 }} />
            <TextInput value={s[1]} onChange={(e) => setSpec(i, 1, e.target.value)} placeholder={t('Значение')} style={{ flex: 1 }} />
            <button className="adm-mini-btn danger" type="button" onClick={() => removeSpec(i)} title={t('Удалить')}>
              <AdmIcon.x width={14} height={14} />
            </button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" type="button" onClick={addSpec} style={{ alignSelf: 'flex-start', marginBottom: 4 }}>
          <AdmIcon.plus width={14} height={14} />{t('Добавить характеристику')}
        </button>
      </div>
    </Drawer>
  );
}

export default function Products({ go: _go, t, openId }: Props) {
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } = useStore();
  const toast = useToast();

  const [q, setQ] = useState('');
  const [catF, setCatF] = useState('');
  const [brandF, setBrandF] = useState('');
  const [stockF, setStockF] = useState<StockFilter>('all');
  const [sort, setSort] = useState<SortState>({ col: 'name', dir: 'asc' });

  const [drawerOpen, setDrawerOpen] = useState<boolean>(!!openId);
  const [editId, setEditId] = useState<string | null>(openId ?? null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openNew = () => { setEditId(null); setDrawerOpen(true); };
  const openEdit = (id: string) => { setEditId(id); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditId(null); };

  const editing = editId ? products.find((p) => p.id === editId) ?? null : null;

  const filtered = products.filter((p) => {
    const ql = q.toLowerCase();
    if (ql && !t(p.name).toLowerCase().includes(ql) && !p.article.toLowerCase().includes(ql) && !p.brand.toLowerCase().includes(ql)) return false;
    if (catF && p.cat !== catF) return false;
    if (brandF && p.brand !== brandF) return false;
    if (stockF === 'in' && p.stock !== 'in') return false;
    if (stockF === 'order' && p.stock !== 'order') return false;
    return true;
  });

  const sorted = sortRows(filtered, sort, {}) as AdminProduct[];

  const handleSave = (data: Omit<AdminProduct, 'id'>) => {
    if (editId) {
      updateProduct(editId, data);
      toast(t('Товар обновлён'));
    } else {
      addProduct(data);
      toast(t('Товар добавлен'));
    }
    closeDrawer();
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast(t('Товар удалён'));
    setConfirmId(null);
  };

  const handleDuplicate = (p: AdminProduct) => {
    addProduct({ ...p, name: p.name + ' (копия)', article: p.article + '-D' });
    toast(t('Товар добавлен'));
  };

  const th = (col: string, label: string, w?: number | string) => (
    <Th label={t(label)} col={col} sort={sort} setSort={setSort} className={w != null ? '' : ''} />
  );

  return (
    <div className="rise">
      <PageHead
        crumb={<span>{t('Товары')}</span>}
        title={t('Товары')}
        sub={t('Управление каталогом — добавление, цены, остатки.')}
        actions={
          <button className="btn btn-accent btn-sm" onClick={openNew}>
            <AdmIcon.plus width={16} height={16} />{t('Добавить товар')}
          </button>
        }
      />

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder={t('Поиск по панели…')} />
        <SelectInput value={catF} onChange={(e) => setCatF(e.target.value)} style={{ width: 180 }}>
          <option value="">{t('Все категории')}</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{t(c.name)}</option>)}
        </SelectInput>
        <SelectInput value={brandF} onChange={(e) => setBrandF(e.target.value)} style={{ width: 160 }}>
          <option value="">{t('Все бренды')}</option>
          {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
        </SelectInput>
        <SelectInput value={stockF} onChange={(e) => setStockF(e.target.value as StockFilter)} style={{ width: 170 }}>
          <option value="all">{t('Любой статус')}</option>
          <option value="in">{t('Только в наличии')}</option>
          <option value="order">{t('Только под заказ')}</option>
        </SelectInput>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--t-faint)' }}>
          {sorted.length} {t('из')} {products.length}
        </span>
      </Toolbar>

      <div className="adm-table-wrap">
        {sorted.length === 0 ? (
          <EmptyState icon={AdmIcon.box} title={t('Ничего не найдено')} body={t('Измените запрос или фильтры.')} />
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                {th('name', 'Наименование')}
                {th('brand', 'Бренд', 130)}
                {th('cat', 'Категория', 140)}
                {th('article', 'Артикул', 120)}
                {th('price', 'Цена, ₽', 130)}
                {th('stock', 'Наличие', 110)}
                <th style={{ width: 90 }}>{t('Действия')}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="adm-td-strong">{t(p.name)}</span>
                    <div className="adm-td-sub">{p.type}</div>
                  </td>
                  <td>{p.brand}</td>
                  <td>{t(categories.find((c) => c.id === p.cat)?.name ?? p.cat)}</td>
                  <td><span className="num" style={{ color: 'var(--t-muted)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{p.article}</span></td>
                  <td className="num">
                    {p.price != null
                      ? <span style={{ fontWeight: 600 }}>{afmt(p.price)} ₽</span>
                      : <span style={{ color: 'var(--t-faint)', fontFamily: 'var(--f-sans)' }}>{t('Цена по запросу')}</span>}
                  </td>
                  <td>
                    <StockBadge stock={p.stock} t={t} />
                    {p.stock === 'in' && p.qty > 0 && (
                      <div className="adm-td-sub">{p.qty} {t('шт')}</div>
                    )}
                  </td>
                  <td>
                    <div className="adm-row-actions">
                      <button className="adm-mini-btn" title={t('Редактировать')} onClick={() => openEdit(p.id)}>
                        <AdmIcon.edit width={14} height={14} />
                      </button>
                      <button className="adm-mini-btn" title={t('Дублировать')} onClick={() => handleDuplicate(p)}>
                        <AdmIcon.copy width={14} height={14} />
                      </button>
                      <button className="adm-mini-btn danger" title={t('Удалить')} onClick={() => setConfirmId(p.id)}>
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
        <ProductForm
          product={editing}
          categories={categories}
          brands={brands}
          t={t}
          onSave={handleSave}
          onClose={closeDrawer}
          title={editing ? t('Редактировать') : t('Новый товар')}
        />
      )}

      {confirmId && (
        <ConfirmModal
          title={t('Точно удалить?')}
          body={t('Это действие нельзя отменить.')}
          confirmLabel={t('Да, удалить')}
          onConfirm={() => handleDelete(confirmId)}
          onClose={() => setConfirmId(null)}
          t={t}
        />
      )}
    </div>
  );
}
