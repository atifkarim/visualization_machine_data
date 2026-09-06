/* Dependency-free, offline dashboard. Dataset values are rendered as text only. */
'use strict';
const $ = id => document.getElementById(id);
const state = {id: null, metadata: null, offset: 0, total: 0, filters: new URLSearchParams(), generation: 0};
const number = value => new Intl.NumberFormat(undefined, {maximumFractionDigits: 3}).format(value);
function status(message = '', error = false) {
  $('status').textContent = message;
  $('status').className = error ? 'error' : '';
}
async function api(url, options = {}) {
  const response = await fetch(url, {...options, headers: {'X-Requested-With': 'DataExplorer', ...options.headers}});
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}
function option(value, label = value) { return new Option(label, value); }
function fillSelect(id, columns, empty = false) {
  $(id).replaceChildren(...(empty ? [option('', 'All rows')] : []), ...columns.map(c => option(c.name, `${c.name} · ${c.type}`)));
}
function table(id, columns, rows) {
  const head = document.createElement('thead');
  const tr = document.createElement('tr');
  for (const name of columns) { const th = document.createElement('th'); th.scope = 'col'; th.textContent = name; tr.append(th); }
  head.append(tr);
  const body = document.createElement('tbody');
  for (const row of rows) {
    const line = document.createElement('tr');
    for (const name of columns) {
      const td = document.createElement('td');
      td.textContent = row[name] == null ? '—' : String(row[name]);
      td.title = td.textContent; line.append(td);
    }
    body.append(line);
  }
  $(id).replaceChildren(head, body);
}
async function refreshList() {
  const result = await api('/api/datasets');
  $('limits').textContent = `Up to ${result.limits.upload_mb} MB · ${number(result.limits.rows)} rows · ${result.limits.columns} columns per file`;
  $('datasets').replaceChildren(...result.datasets.map(dataset => {
    const button = document.createElement('button');
    button.className = `dataset${dataset.id === state.id ? ' selected' : ''}`;
    button.textContent = dataset.name;
    const detail = document.createElement('small');
    detail.textContent = `${number(dataset.rows)} rows · ${dataset.columns.length} columns`;
    button.append(detail);
    button.addEventListener('click', () => selectDataset(dataset.id).catch(e => status(e.message, true)));
    return button;
  }));
  return result.datasets;
}
async function selectDataset(id) {
  const generation = ++state.generation;
  status('Loading dataset…');
  const result = await api(`/api/datasets/${id}`);
  if (generation !== state.generation) return;
  state.id = id; state.metadata = result.metadata; state.offset = 0; state.filters = new URLSearchParams();
  const metadata = result.metadata;
  $('empty').hidden = true; $('explorer').hidden = false; $('dataset-name').textContent = metadata.name;
  $('stats').replaceChildren(...[[metadata.rows, 'Rows'], [metadata.columns.length, 'Columns'], [metadata.missing_cells, 'Missing cells'], [metadata.duplicate_rows, 'Duplicate rows']].map(([value, label]) => {
    const card = document.createElement('div'); card.className = 'stat';
    const strong = document.createElement('strong'); strong.textContent = number(value);
    const caption = document.createElement('span'); caption.textContent = label; card.append(strong, caption); return card;
  }));
  $('warnings').hidden = !metadata.warnings.length;
  $('warnings').textContent = metadata.warnings.join(' ');
  fillSelect('x', metadata.columns);
  const numeric = metadata.columns.filter(c => c.type === 'number');
  fillSelect('y', numeric);
  fillSelect('filter-column', metadata.columns, true); $('filter-value').value = '';
  const dimension = metadata.columns.find(c => c.type === 'datetime') || metadata.columns.find(c => c.type === 'text') || metadata.columns[0];
  $('x').value = dimension.name;
  const measure = numeric.find(c => c.name !== dimension.name);
  if (measure) $('y').value = measure.name;
  $('aggregation').value = measure ? 'mean' : 'count';
  $('y').disabled = !measure;
  $('chart-type').value = dimension.type === 'text' ? 'bar' : 'line';
  table('quality', ['Column', 'Type', 'Missing', 'Unique'], metadata.columns.map(c => ({Column: c.name, Type: c.type, Missing: c.missing, Unique: c.unique})));
  renderPreview(result);
  await refreshList();
  if (generation !== state.generation) return;
  await updateChart();
  if (generation === state.generation) status();
}
function renderPreview(result) {
  state.total = result.total_rows;
  table('preview', state.metadata.columns.map(c => c.name), result.rows);
  $('page-info').textContent = result.total_rows ? `${state.offset + 1}–${Math.min(state.offset + 50, result.total_rows)} of ${number(result.total_rows)} rows` : 'No matching rows';
  $('previous').disabled = state.offset === 0;
  $('next').disabled = state.offset + 50 >= result.total_rows;
  $('export').href = `/api/datasets/${state.id}/export?${state.filters}`;
}
async function updatePreview() {
  const id = state.id, generation = state.generation;
  const params = new URLSearchParams(state.filters); params.set('offset', state.offset);
  const result = await api(`/api/datasets/${id}?${params}`);
  if (generation === state.generation) renderPreview(result);
}
function svgElement(name, attrs = {}, text = null) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  if (text != null) element.textContent = text;
  return element;
}
function drawChart(data, xName, style) {
  $('chart').replaceChildren(); $('legend').replaceChildren();
  if (!data.labels.length) { $('chart').textContent = 'No matching data. Change the filter to continue.'; return; }
  const values = data.series.flatMap(s => s.values).filter(v => v != null && Number.isFinite(v));
  if (!values.length) { $('chart').textContent = 'The selected measures contain no numeric values for these rows.'; return; }
  const width = 960, height = 340, left = 85, top = 20, plotWidth = 850, plotHeight = 250;
  const min = Math.min(0, ...values), max = Math.max(0, ...values);
  const span = max - min || 1;
  const yScale = value => top + plotHeight - ((value - min) / span) * plotHeight;
  const xColumn = state.metadata.columns.find(c => c.name === xName);
  if (style === 'scatter' && xColumn.type !== 'number') throw new Error('Scatter charts require a numeric X axis. Choose a numeric dimension or another chart style.');
  const continuous = style !== 'bar' && ['number', 'datetime'].includes(xColumn.type);
  const xs = continuous ? data.labels.map(v => xColumn.type === 'datetime' ? Date.parse(v) : Number(v)) : data.labels.map((_, i) => i);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const xScale = i => continuous ? left + (xMax === xMin ? plotWidth / 2 : (xs[i] - xMin) / (xMax - xMin) * plotWidth) : left + (i + .5) / data.labels.length * plotWidth;
  const svg = svgElement('svg', {viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `${style} chart: ${data.series.map(s => s.name).join(', ')} by ${xName}`});
  svg.append(svgElement('title', {}, `${data.series.map(s => s.name).join(', ')} by ${xName}`));
  for (let i = 0; i <= 5; i++) {
    const value = min + span * i / 5, y = yScale(value);
    svg.append(svgElement('line', {x1: left, x2: width - 25, y1: y, y2: y, class: 'grid'}));
    svg.append(svgElement('text', {x: left - 10, y: y + 4, 'text-anchor': 'end'}, number(value)));
  }
  const stride = Math.max(1, Math.ceil(data.labels.length / 7));
  data.labels.forEach((label, i) => {
    if (i % stride === 0) svg.append(svgElement('text', {x: xScale(i), y: height - 43, 'text-anchor': 'middle'}, String(label).slice(0, 16)));
  });
  svg.append(svgElement('text', {x: left + plotWidth / 2, y: height - 10, 'text-anchor': 'middle'}, xName));
  data.series.forEach((series, seriesIndex) => {
    const className = `series-${seriesIndex}`;
    let path = '', disconnected = true;
    series.values.forEach((value, i) => {
      if (value == null || !Number.isFinite(value)) { disconnected = true; return; }
      const x = xScale(i), y = yScale(value);
      if (style === 'line') { path += `${disconnected ? 'M' : 'L'}${x},${y} `; disconnected = false; }
      let mark;
      if (style === 'bar') {
        const slot = plotWidth / data.labels.length;
        const barWidth = slot * .8 / data.series.length;
        mark = svgElement('rect', {x: x - slot * .4 + seriesIndex * barWidth, y: Math.min(y, yScale(0)), width: barWidth, height: Math.abs(y - yScale(0)), class: className});
      } else {
        mark = svgElement('circle', {cx: x, cy: y, r: style === 'scatter' ? 3.5 : 2.5, class: className});
      }
      mark.append(svgElement('title', {}, `${data.labels[i]} · ${series.name}: ${number(value)}`)); svg.append(mark);
    });
    if (style === 'line') svg.append(svgElement('path', {d: path, class: className}));
    const item = document.createElement('span'); item.className = className; item.textContent = series.name; $('legend').append(item);
  });
  $('chart').append(svg);
}
async function updateChart() {
  const generation = state.generation;
  const params = new URLSearchParams(state.filters);
  params.set('x', $('x').value); params.set('aggregation', $('aggregation').value);
  for (const opt of $('y').selectedOptions) params.append('y', opt.value);
  const style = $('chart-type').value, xName = $('x').value;
  $('chart-note').textContent = 'Calculating…';
  try {
    const result = await api(`/api/datasets/${state.id}/chart?${params}`);
    if (generation !== state.generation) return;
    drawChart(result, xName, style);
    $('chart-note').textContent = `${number(result.matched_rows)} matching rows · ${number(result.shown_points)} plotted points. ${result.omitted_dimension_rows ? `${number(result.omitted_dimension_rows)} rows omitted because the dimension is missing. ` : ''}${result.truncated ? `Showing the first 1,000 of ${number(result.total_points)} points, sorted by dimension. Filter your data to narrow the result.` : ''} Hover over a point for its value.`;
  } catch (error) {
    if (generation === state.generation) { $('chart').replaceChildren(); $('legend').replaceChildren(); $('chart-note').textContent = error.message; }
    throw error;
  }
}
$('upload-form').addEventListener('submit', async event => {
  event.preventDefault(); $('upload-button').disabled = true; status('Importing and profiling your data…');
  try {
    const result = await api('/api/datasets', {method: 'POST', body: new FormData(event.target)});
    event.target.reset(); await selectDataset(result.id); status('Dataset imported and saved.');
  } catch (error) { status(error.message, true); }
  finally { $('upload-button').disabled = false; }
});
$('aggregation').addEventListener('change', () => { $('y').disabled = $('aggregation').value === 'count'; });
$('chart-form').addEventListener('submit', async event => {
  event.preventDefault(); ++state.generation; state.offset = 0;
  state.filters = new URLSearchParams();
  if ($('filter-column').value) { state.filters.set('filter_column', $('filter-column').value); state.filters.set('filter_value', $('filter-value').value); }
  status('Updating view…');
  const results = await Promise.allSettled([updateChart(), updatePreview()]);
  const error = results.find(result => result.status === 'rejected');
  status(error ? error.reason.message : '', Boolean(error));
});
for (const [id, direction] of [['previous', -1], ['next', 1]]) {
  $(id).addEventListener('click', async () => {
    const previous = state.offset;
    state.offset = Math.max(0, state.offset + 50 * direction);
    $('previous').disabled = true; $('next').disabled = true;
    try { await updatePreview(); } catch (error) { state.offset = previous; status(error.message, true); $('previous').disabled = previous === 0; $('next').disabled = previous + 50 >= state.total; }
  });
}
$('delete').addEventListener('click', async () => {
  if (!confirm(`Delete “${state.metadata.name}” from this workspace? This cannot be undone.`)) return;
  try {
    await api(`/api/datasets/${state.id}`, {method: 'DELETE'}); ++state.generation;
    state.id = null; state.metadata = null; $('explorer').hidden = true; $('empty').hidden = false;
    const datasets = await refreshList();
    if (datasets.length) await selectDataset(datasets[0].id);
    status('Dataset deleted.');
  } catch (error) { status(error.message, true); }
});
refreshList().then(datasets => datasets.length && selectDataset(datasets[0].id)).catch(error => status(error.message, true));
