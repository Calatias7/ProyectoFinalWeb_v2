import React, { useState } from 'react';
import api from '../api/client';

/* =============== TEMA (estilo “panel” con inputs blancos) =============== */
const palette = {
  // fondo general oscuro con gradiente sutil
  bgTop: '#0c1f3b',
  bgMid: '#102e57',
  bgBot: '#103c6e',

  // tarjetas
  card: '#183766',
  cardBorder: 'rgba(255,255,255,0.10)',
  cardShadow: 'rgba(0,0,0,0.20)',

  // texto en fondos oscuros
  text: '#eef4ff',
  textSoft: '#c7d4ea',

  // Inputs blancos
  inputBg: '#ffffff',
  inputText: '#0f172a',
  inputPlaceholder: '#94a3b8',
  inputBorder: '#cbd5e1',
  inputBorderFocus: '#3a84ff',

  // botones
  btn: '#1677ff',
  btnHover: '#1464d6',
};

/* Fondo + tipografías */
const page = {
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${palette.bgTop} 0%, ${palette.bgMid} 45%, ${palette.bgBot} 100%)`,
  color: palette.text,
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
};

const shell = { maxWidth: 1220, margin: '0 auto', padding: '28px 22px 40px' };
const topbar = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 };
const brand  = { fontWeight: 900, letterSpacing: .4, fontSize: 28 };
const userBadge = { fontSize: 14, color: palette.textSoft };

/* Tarjetas */
const cardWrap = {
  background: palette.card,
  border: `1px solid ${palette.cardBorder}`,
  borderRadius: 18,
  boxShadow: `0 10px 24px ${palette.cardShadow}`,
  padding: 18
};
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 };
const cardTitle  = { fontSize: 20, fontWeight: 800, color: palette.text };

const section = { ...cardWrap, padding: 16 };
const sectionTitle = { fontSize: 15, fontWeight: 800, marginBottom: 10, color: palette.text, letterSpacing: .2 };

const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 };

const field = { display: 'flex', flexDirection: 'column', gap: 6 };
const label = { fontSize: 12, color: palette.textSoft, fontWeight: 800, letterSpacing: .3 };

/* ====== INPUTS BLANCOS (como en tu dashboard) ====== */
const baseInput = {
  borderRadius: 12,
  border: `1px solid ${palette.inputBorder}`,
  background: palette.inputBg,
  color: palette.inputText,
  fontSize: 15,
  padding: '13px 16px',
  outline: 'none',
  boxShadow: 'inset 0 0 0 0 transparent',
  transition: 'border-color .15s ease, box-shadow .15s ease, background .15s ease'
};
const inputBase  = { ...baseInput };
const selectBase = { ...baseInput, paddingRight: 42, appearance: 'none', WebkitAppearance: 'none' };
const numberBase = { ...baseInput, MozAppearance: 'textfield' };

const divider = { height: 1, background: palette.cardBorder, margin: '10px 0 8px' };

const btnGhost = {
  borderRadius: 10,
  padding: '12px 16px',
  border: `1px solid ${palette.cardBorder}`,
  color: palette.text,
  background: 'transparent',
  cursor: 'pointer'
};
const btnPrimary = (disabled) => ({
  borderRadius: 10,
  border: 'none',
  padding: '12px 18px',
  fontWeight: 800,
  color: '#fff',
  background: disabled ? '#568de6' : palette.btn,
  cursor: disabled ? 'not-allowed' : 'pointer'
});

/* ===================== TOASTS ===================== */
const toastWrap = { position: 'fixed', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9999 };
const toastBase = (bg) => ({
  minWidth: 280, maxWidth: 420, padding: '10px 12px', borderRadius: 12,
  color: '#fff', background: bg, boxShadow: '0 10px 24px rgba(0,0,0,.25)', fontSize: 14
});
const Toast = ({ toasts, remove }) => (
  <div style={toastWrap}>
    {toasts.map(t => (
      <div key={t.id} style={toastBase(t.bg)} onClick={() => remove(t.id)}>
        <strong style={{ marginRight: 6 }}>{t.icon}</strong>{t.msg}
      </div>
    ))}
  </div>
);

/* ===================== DEFAULTS ===================== */
const defaults = {
  numeroDocumento: 'GT2025DUCA001234',
  fechaEmision: '2025-10-04',
  paisEmisor: 'GT',
  tipoOperacion: 'IMPORTACION',
  exportador: { id: 'EXP-00145', nombre: 'Comercial del Norte S.A.', direccion: 'Zona 12, Ciudad de Guatemala', tel: '+50245678900', email: 'exportaciones@comnorte.gt' },
  importador: { id: 'IMP-00984', nombre: 'Distribuciones del Sur Ltda.', direccion: 'San Salvador, El Salvador', tel: '+50377780000', email: 'compras@distsur.sv' },
  transporte: { medio: 'TERRESTRE', placa: 'C123BGT', conductorNombre: 'Juan Pérez', conductorLicencia: 'L-987654', paisLicencia: 'GT', aduanaSalida: 'PUERTO BARRIOS', aduanaEntrada: 'SAN CRISTÓBAL', paisDestino: 'SV', kms: 325 },
  mercancias: [
    { linea: 1, descripcion: 'Componentes electrónicos', cantidad: 500, unidad: 'CAJA', valorUnitario: 45.5, paisOrigen: 'CN' },
    { linea: 2, descripcion: 'Cables industriales', cantidad: 200, unidad: 'ROLLO', valorUnitario: 20, paisOrigen: 'MX' }
  ],
  valores: { factura: 32500, transporte: 1500, seguro: 300, otros: 100, aduanaTotal: 34400, moneda: 'USD' },
  selectivo: { codigo: 'R', descripcion: 'Revisión documental' },
  estadoDocumento: 'CONFIRMADO',
  firma: 'AB12CD34EF56GH78'
};

/* ===================== APP ===================== */
export default function SenderDuca() {
  const [f, setF] = useState({
    numeroDocumento: defaults.numeroDocumento,
    fechaEmision: defaults.fechaEmision,
    paisEmisor: defaults.paisEmisor,
    tipoOperacion: defaults.tipoOperacion,
    exportador: { ...defaults.exportador },
    importador: { ...defaults.importador },
    transporte: { ...defaults.transporte },
    mercancias: [...defaults.mercancias],
    valores: { ...defaults.valores },
    selectivo: { ...defaults.selectivo },
    estadoDocumento: defaults.estadoDocumento,
    firma: defaults.firma
  });
  const [sending, setSending] = useState(false);

  /* toasts */
  const [toasts, setToasts] = useState([]);
  const push = (msg, type = 'info') => {
    const paletteBG = { success: '#16a34a', warn: '#f59e0b', error: '#dc2626', info: '#2563eb' };
    const icon = { success: '✅', warn: '⚠️', error: '❌', info: 'ℹ️' }[type];
    const id = crypto.randomUUID();
    setToasts(t => [...t, { id, msg, bg: paletteBG[type] || paletteBG.info, icon }]);
    setTimeout(() => remove(id), 4500);
  };
  const remove = (id) => setToasts(t => t.filter(x => x.id !== id));

  /* helpers */
  const setField = (path, value) => {
    setF(prev => {
      const clone = structuredClone(prev);
      let ref = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return clone;
    });
  };
  const setMerc = (idx, key, value) => {
    setF(prev => {
      const clone = structuredClone(prev);
      clone.mercancias[idx][key] = value;
      return clone;
    });
  };
  const addMerc = () => {
    setF(prev => {
      const clone = structuredClone(prev);
      const nextLinea = (clone.mercancias.at(-1)?.linea || 0) + 1;
      clone.mercancias.push({ linea: nextLinea, descripcion: '', cantidad: 0, unidad: 'UN', valorUnitario: 0, paisOrigen: 'GT' });
      return clone;
    });
  };
  const removeMerc = (idx) => setF(prev => {
    const clone = structuredClone(prev);
    if (clone.mercancias.length > 1) clone.mercancias.splice(idx, 1);
    return clone;
  });

  /* payload */
  const buildPayload = () => {
    const toNum = (v) => (v === '' || v === null || isNaN(Number(v))) ? 0 : Number(v);
    const mercancias = f.mercancias.map(m => ({
      linea: toNum(m.linea),
      descripcion: m.descripcion,
      cantidad: toNum(m.cantidad),
      unidadMedida: m.unidad,
      valorUnitario: toNum(m.valorUnitario),
      paisOrigen: m.paisOrigen
    }));
    return {
      duca: {
        numeroDocumento: f.numeroDocumento,
        fechaEmision: f.fechaEmision,
        paisEmisor: f.paisEmisor,
        tipoOperacion: f.tipoOperacion,
        exportador: {
          idExportador: f.exportador.id,
          nombreExportador: f.exportador.nombre,
          direccionExportador: f.exportador.direccion,
          contactoExportador: { telefono: f.exportador.tel, email: f.exportador.email }
        },
        importador: {
          idImportador: f.importador.id,
          nombreImportador: f.importador.nombre,
          direccionImportador: f.importador.direccion,
          contactoImportador: { telefono: f.importador.tel, email: f.importador.email }
        },
        transporte: {
          medioTransporte: f.transporte.medio,
          placaVehiculo: f.transporte.placa,
          conductor: {
            nombreConductor: f.transporte.conductorNombre,
            licenciaConductor: f.transporte.conductorLicencia,
            paisLicencia: f.transporte.paisLicencia
          },
          ruta: {
            aduanaSalida: f.transporte.aduanaSalida,
            aduanaEntrada: f.transporte.aduanaEntrada,
            paisDestino: f.transporte.paisDestino,
            kilometrosAproximados: toNum(f.transporte.kms)
          }
        },
        mercancias: { numeroItems: mercancias.length, items: mercancias },
        valores: {
          valorFactura: toNum(f.valores.factura),
          gastosTransporte: toNum(f.valores.transporte),
          seguro: toNum(f.valores.seguro),
          otrosGastos: toNum(f.valores.otros),
          valorAduanaTotal: toNum(f.valores.aduanaTotal),
          moneda: f.valores.moneda
        },
        resultadoSelectivo: { codigo: f.selectivo.codigo, descripcion: f.selectivo.descripcion },
        estadoDocumento: f.estadoDocumento,
        firmaElectronica: f.firma
      }
    };
  };

  /* validación mínima antes de enviar */
  const validate = () => {
    const missing = [];
    if (!f.numeroDocumento) missing.push('Número de documento');
    if (!f.fechaEmision) missing.push('Fecha de emisión');
    if (!f.paisEmisor) missing.push('País emisor');
    if (!f.exportador.id || !f.exportador.nombre) missing.push('Exportador (ID y Nombre)');
    if (!f.importador.id || !f.importador.nombre) missing.push('Importador (ID y Nombre)');
    if (!f.transporte.medio || !f.transporte.placa) missing.push('Transporte (medio y placa)');
    if (!f.valores.moneda) missing.push('Moneda');
    if (!f.firma) missing.push('Firma');
    const anyValidItem = f.mercancias.some(m => m.descripcion && Number(m.cantidad) > 0);
    if (!anyValidItem) missing.push('Al menos 1 mercancía con descripción y cantidad');
    return missing;
  };

  /* helpers respuesta */
  const isDuplicate = (res) => {
    const d = res?.data?.details || res?.details || {};
    return Object.values(d).some(x => Number(x?.status) === 409);
  };
  const firstValidationMessage = (res) => {
    const d = res?.data?.details || res?.details || {};
    for (const v of Object.values(d)) {
      if (Number(v?.status) === 400) {
        const rb = v?.responseBody;
        const msg = rb?.error || rb?.message || (Array.isArray(rb?.detalles) && rb.detalles[0]) || 'Validación fallida';
        return String(msg);
      }
    }
    return null;
  };
  const anyOk = (res) => {
    if (res?.data?.ok === true) return true;
    const d = res?.data?.details || res?.details || {};
    return Object.values(d).some(x => x?.ok === true || (x?.status >= 200 && x?.status < 300));
  };

  /* enviar al backend autenticado */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const missing = validate();
    if (missing.length) {
      push(`Faltan datos: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}`, 'warn');
      return;
    }

    setSending(true);
    try {
      const payload = buildPayload();
      const { data } = await api.post('/duca/recepcion', payload);
      push(data?.message || 'DUCA enviada correctamente', 'success');
    } catch (err) {
      const res = err?.response?.data;
      const vmsg = res?.error || res?.message || (Array.isArray(res?.detalles) && res.detalles[0]) || err?.message;
      // Duplicado
      if (res && String(res.error || '').toLowerCase().includes('ya registrada')) {
        push('La DUCA ya existe.', 'warn');
      } else if (res && (res?.status === 400 || Array.isArray(res?.detalles))) {
        push(`Validación fallida: ${vmsg}`, 'error');
      } else {
        push(vmsg || 'No se pudo enviar.', 'error');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={page}>
      {/* Estilos globales para inputs blancos y focus azul */}
      <style>{`

      html, body {
    margin: 0;
    padding: 0;
    border: none !important;
    background-color: #0b1e3a; /* mismo color del fondo principal */
  }
        ::placeholder { color:${palette.inputPlaceholder}; }
        input::placeholder, textarea::placeholder { color:${palette.inputPlaceholder}; }

        input, select, textarea, button { outline:none; }
        input:focus, select:focus, textarea:focus {
          border-color:${palette.inputBorderFocus} !important;
          box-shadow: 0 0 0 3px rgba(58,132,255,.25) !important;
          background:#ffffff !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(20%); opacity:.8; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .btn-primary:hover { background:${palette.btnHover}; }
      `}</style>

      {/* TOASTS */}
      <Toast toasts={toasts} remove={remove} />

      <div style={shell}>
        <div style={topbar}>
          <div style={brand}>SIGLAD</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={userBadge}>Usuario: <strong>{localStorage.getItem('display_name') || 'importador'}</strong></div>
            <button 
              style={{
                ...btnGhost,
                fontSize: 14,
                padding: '8px 12px',
                color: palette.textSoft,
                border: `1px solid ${palette.textSoft}`,
                borderRadius: 8
              }}
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                document.cookie = '';
                window.location.replace('/');
              }}
            >
              <i className="bi bi-box-arrow-right" style={{ marginRight: 6 }}></i>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div style={{ ...cardWrap, marginBottom: 16 }}>
          <div style={cardHeader}>
            <div style={cardTitle}>Declaraciones</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" style={btnGhost} onClick={() => window.location.reload()}>Limpiar</button>
            </div>
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 1 Identificación */}
            <div style={section}>
              <div style={sectionTitle}>1. Identificación del Documento</div>
              <div style={grid3}>
                <div style={field}>
                  <label style={label}>Número de Documento</label>
                  <input style={inputBase} value={f.numeroDocumento} onChange={e => setField(['numeroDocumento'], e.target.value)} placeholder="GT2025DUCA001234" />
                </div>
                <div style={field}>
                  <label style={label}>Fecha de Emisión</label>
                  <input style={inputBase} type="date" value={f.fechaEmision} onChange={e => setField(['fechaEmision'], e.target.value)} />
                </div>
                <div style={field}>
                  <label style={label}>País Emisor</label>
                  <input style={inputBase} value={f.paisEmisor} onChange={e => setField(['paisEmisor'], e.target.value.toUpperCase())} placeholder="GT" />
                </div>
              </div>
              <div style={{ ...field, marginTop: 10 }}>
                <label style={label}>Tipo de Operación</label>
                <select style={selectBase} value={f.tipoOperacion} onChange={e => setField(['tipoOperacion'], e.target.value)}>
                  <option value="IMPORTACION">IMPORTACIÓN</option>
                  <option value="EXPORTACION">EXPORTACIÓN</option>
                  <option value="TRANSITO">TRÁNSITO</option>
                </select>
              </div>
            </div>

            {/* 2-3 Exportador / Importador */}
            <div style={section}>
              <div style={sectionTitle}>2. Exportador</div>
              <div style={grid2}>
                <div style={field}><label style={label}>ID Exportador</label>
                  <input style={inputBase} value={f.exportador.id} onChange={e => setField(['exportador','id'], e.target.value)} /></div>
                <div style={field}><label style={label}>Nombre Exportador</label>
                  <input style={inputBase} value={f.exportador.nombre} onChange={e => setField(['exportador','nombre'], e.target.value)} /></div>
                <div style={field}><label style={label}>Dirección</label>
                  <input style={inputBase} value={f.exportador.direccion} onChange={e => setField(['exportador','direccion'], e.target.value)} /></div>
                <div style={field}><label style={label}>Teléfono</label>
                  <input style={inputBase} value={f.exportador.tel} onChange={e => setField(['exportador','tel'], e.target.value)} /></div>
                <div style={field}><label style={label}>Email</label>
                  <input style={inputBase} value={f.exportador.email} onChange={e => setField(['exportador','email'], e.target.value)} /></div>
              </div>

              <div style={divider} />

              <div style={sectionTitle}>3. Importador</div>
              <div style={grid2}>
                <div style={field}><label style={label}>ID Importador</label>
                  <input style={inputBase} value={f.importador.id} onChange={e => setField(['importador','id'], e.target.value)} /></div>
                <div style={field}><label style={label}>Nombre Importador</label>
                  <input style={inputBase} value={f.importador.nombre} onChange={e => setField(['importador','nombre'], e.target.value)} /></div>
                <div style={field}><label style={label}>Dirección</label>
                  <input style={inputBase} value={f.importador.direccion} onChange={e => setField(['importador','direccion'], e.target.value)} /></div>
                <div style={field}><label style={label}>Teléfono</label>
                  <input style={inputBase} value={f.importador.tel} onChange={e => setField(['importador','tel'], e.target.value)} /></div>
                <div style={field}><label style={label}>Email</label>
                  <input style={inputBase} value={f.importador.email} onChange={e => setField(['importador','email'], e.target.value)} /></div>
              </div>
            </div>

            {/* 4 Transporte */}
            <div style={section}>
              <div style={sectionTitle}>4. Transporte</div>
              <div style={grid3}>
                <div style={field}><label style={label}>Medio</label>
                  <select style={selectBase} value={f.transporte.medio} onChange={e => setField(['transporte','medio'], e.target.value)}>
                    <option value="TERRESTRE">TERRESTRE</option>
                    <option value="AEREO">AÉREO</option>
                    <option value="MARITIMO">MARÍTIMO</option>
                  </select></div>
                <div style={field}><label style={label}>Placa</label>
                  <input style={inputBase} value={f.transporte.placa} onChange={e => setField(['transporte','placa'], e.target.value)} /></div>
                <div style={field}><label style={label}>País Licencia</label>
                  <input style={inputBase} value={f.transporte.paisLicencia} onChange={e => setField(['transporte','paisLicencia'], e.target.value.toUpperCase())} /></div>
              </div>
              <div style={grid3}>
                <div style={field}><label style={label}>Conductor</label>
                  <input style={inputBase} value={f.transporte.conductorNombre} onChange={e => setField(['transporte','conductorNombre'], e.target.value)} /></div>
                <div style={field}><label style={label}>Licencia</label>
                  <input style={inputBase} value={f.transporte.conductorLicencia} onChange={e => setField(['transporte','conductorLicencia'], e.target.value)} /></div>
                <div style={field}><label style={label}>KMs Aprox.</label>
                  <input style={numberBase} type="number" value={f.transporte.kms} onChange={e => setField(['transporte','kms'], e.target.value)} /></div>
              </div>
              <div style={grid3}>
                <div style={field}><label style={label}>Aduana Salida</label>
                  <input style={inputBase} value={f.transporte.aduanaSalida} onChange={e => setField(['transporte','aduanaSalida'], e.target.value)} /></div>
                <div style={field}><label style={label}>Aduana Entrada</label>
                  <input style={inputBase} value={f.transporte.aduanaEntrada} onChange={e => setField(['transporte','aduanaEntrada'], e.target.value)} /></div>
                <div style={field}><label style={label}>País Destino</label>
                  <input style={inputBase} value={f.transporte.paisDestino} onChange={e => setField(['transporte','paisDestino'], e.target.value.toUpperCase())} /></div>
              </div>
            </div>

            {/* 5 Mercancías */}
            <div style={section}>
              <div style={sectionTitle}>5. Mercancías</div>
              {f.mercancias.map((m, idx) => (
                <div key={idx} style={{ ...section, background: 'transparent', border: `1px dashed ${palette.cardBorder}`, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong>Ítem #{m.linea}</strong>
                    {f.mercancias.length > 1 && <button type="button" onClick={() => removeMerc(idx)} style={btnGhost}>Eliminar</button>}
                  </div>
                  <div style={grid3}>
                    <div style={field}><label style={label}>Descripción</label>
                      <input style={inputBase} value={m.descripcion} onChange={e => setMerc(idx, 'descripcion', e.target.value)} /></div>
                    <div style={field}><label style={label}>Cantidad</label>
                      <input style={numberBase} type="number" value={m.cantidad} onChange={e => setMerc(idx, 'cantidad', e.target.value)} /></div>
                    <div style={field}><label style={label}>Unidad</label>
                      <input style={inputBase} value={m.unidad} onChange={e => setMerc(idx, 'unidad', e.target.value.toUpperCase())} /></div>
                  </div>
                  <div style={grid3}>
                    <div style={field}><label style={label}>Valor Unitario</label>
                      <input style={numberBase} type="number" step="0.01" value={m.valorUnitario} onChange={e => setMerc(idx, 'valorUnitario', e.target.value)} /></div>
                    <div style={field}><label style={label}>País Origen</label>
                      <input style={inputBase} value={m.paisOrigen} onChange={e => setMerc(idx, 'paisOrigen', e.target.value.toUpperCase())} /></div>
                    <div style={field}><label style={label}>Línea</label>
                      <input style={numberBase} type="number" value={m.linea} onChange={e => setMerc(idx, 'linea', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <div><button type="button" onClick={addMerc} style={btnGhost}>Añadir ítem</button></div>
            </div>

            {/* 6 Valores y estado */}
            <div style={section}>
              <div style={sectionTitle}>6. Valores y Estado</div>
              <div style={grid3}>
                <div style={field}><label style={label}>Valor Factura</label>
                  <input style={numberBase} type="number" step="0.01" value={f.valores.factura} onChange={e => setField(['valores','factura'], e.target.value)} /></div>
                <div style={field}><label style={label}>Gastos Transporte</label>
                  <input style={numberBase} type="number" step="0.01" value={f.valores.transporte} onChange={e => setField(['valores','transporte'], e.target.value)} /></div>
                <div style={field}><label style={label}>Seguro</label>
                  <input style={numberBase} type="number" step="0.01" value={f.valores.seguro} onChange={e => setField(['valores','seguro'], e.target.value)} /></div>
              </div>
              <div style={grid3}>
                <div style={field}><label style={label}>Otros Gastos</label>
                  <input style={numberBase} type="number" step="0.01" value={f.valores.otros} onChange={e => setField(['valores','otros'], e.target.value)} /></div>
                <div style={field}><label style={label}>Valor Aduana Total</label>
                  <input style={numberBase} type="number" step="0.01" value={f.valores.aduanaTotal} onChange={e => setField(['valores','aduanaTotal'], e.target.value)} /></div>
                <div style={field}><label style={label}>Moneda</label>
                  <input style={inputBase} value={f.valores.moneda} onChange={e => setField(['valores','moneda'], e.target.value.toUpperCase())} /></div>
              </div>

              <div style={divider} />

              <div style={grid2}>
                <div style={field}><label style={label}>Resultado Selectivo (Código)</label>
                  <input style={inputBase} value={f.selectivo.codigo} onChange={e => setField(['selectivo','codigo'], e.target.value.toUpperCase())} /></div>
                <div style={field}><label style={label}>Descripción</label>
                  <input style={inputBase} value={f.selectivo.descripcion} onChange={e => setField(['selectivo','descripcion'], e.target.value)} /></div>
              </div>

              <div style={grid2}>
                <div style={field}><label style={label}>Estado del Documento</label>
                  <select style={selectBase} value={f.estadoDocumento} onChange={e => setField(['estadoDocumento'], e.target.value)}>
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="ANULADO">ANULADO</option>
                  </select>
                </div>
                <div style={field}><label style={label}>Firma Electrónica</label>
                  <input style={inputBase} value={f.firma} onChange={e => setField(['firma'], e.target.value)} /></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                className="btn-primary"
                style={btnPrimary(sending)}
                disabled={sending}
              >
                {sending ? 'Enviando…' : 'Enviar DUCA'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
