(() => {
  'use strict';

  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const MAX_FILES = 20;
  const PREVIEW_BYTES = 256 * 1024;
  const PDF_SCAN_BYTES = 512 * 1024;
  const state = { items: [], selectedId: null, processing: false };
  const $ = (selector) => document.querySelector(selector);

  document.addEventListener('DOMContentLoaded', init, { once: true });

  function init() {
    if (!$('#fileInput')) return;

    $('#sessionId').textContent = crypto.randomUUID?.().slice(0, 8).toUpperCase()
      || Math.random().toString(36).slice(2, 10).toUpperCase();

    const input = $('#fileInput');
    const drop = $('#dropZone');

    $('#pickFiles').addEventListener('click', () => input.click());
    input.addEventListener('change', (event) => {
      queueFiles(event.target.files);
      event.target.value = '';
    });

    ['dragenter', 'dragover'].forEach((name) => {
      drop.addEventListener(name, (event) => {
        event.preventDefault();
        drop.classList.add('over');
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
      });
    });

    ['dragleave', 'drop'].forEach((name) => {
      drop.addEventListener(name, (event) => {
        event.preventDefault();
        drop.classList.remove('over');
      });
    });

    drop.addEventListener('drop', (event) => queueFiles(event.dataTransfer?.files || []));
    $('#typeFilter').addEventListener('change', renderList);
    $('#fileSearch').addEventListener('input', renderList);
    $('#exportAll').addEventListener('click', exportAll);
    $('#clearAll').addEventListener('click', clearAll);
    $('#removeSelected').addEventListener('click', removeSelected);
    $('#copyHash').addEventListener('click', copySelectedHash);

    renderList();
    renderDetail();
  }

  async function queueFiles(fileList) {
    if (state.processing) {
      notify('File processing is already in progress.');
      return;
    }

    const files = [...fileList].slice(0, Math.max(0, MAX_FILES - state.items.length));
    if (!files.length) {
      notify(state.items.length >= MAX_FILES ? `The browser session is limited to ${MAX_FILES} files.` : 'No files selected.');
      return;
    }

    const accepted = [];
    const rejected = [];
    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) rejected.push(`${file.name}: over 50 MB`);
      else accepted.push(file);
    });

    if (rejected.length) notify(`Skipped ${rejected.length} file${rejected.length === 1 ? '' : 's'} over the browser limit.`);
    if (!accepted.length) return;

    state.processing = true;
    setBusy(true);

    for (let index = 0; index < accepted.length; index += 1) {
      const file = accepted[index];
      const item = {
        id: crypto.randomUUID?.() || `${Date.now()}-${index}`,
        file,
        type: inferTypeFromNameAndMime(file),
        status: 'processing',
        error: '',
        meta: {}
      };
      state.items.push(item);
      state.selectedId ||= item.id;
      updateProgress((index / accepted.length) * 100, `Inspecting ${file.name}`);
      renderList();
      renderDetail();

      try {
        const result = await inspectFile(file);
        item.type = result.type;
        item.meta = result.meta;
        item.status = result.warnings.length ? 'warning' : 'complete';
        item.warnings = result.warnings;
      } catch (error) {
        item.status = 'error';
        item.error = error instanceof Error ? error.message : String(error);
      }

      updateProgress(((index + 1) / accepted.length) * 100, `Completed ${file.name}`);
      renderList();
      renderDetail();
    }

    state.processing = false;
    setBusy(false);
    window.setTimeout(() => updateProgress(0, 'Ready'), 500);
    notify(`Processed ${accepted.length} file${accepted.length === 1 ? '' : 's'} locally.`);
  }

  async function inspectFile(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const signature = detectSignature(bytes, file);
    const type = signature.type || inferTypeFromNameAndMime(file) || 'other';
    const warnings = [];
    const meta = {
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: formatBytes(file.size),
      browserMime: file.type || 'not supplied',
      detectedType: type,
      detectedFormat: signature.format,
      signatureConfidence: signature.confidence,
      lastModified: new Date(file.lastModified).toISOString(),
      sha256: await sha256(buffer),
      analysisMode: 'local browser',
      extractionScope: 'bounded metadata inspection; no file upload'
    };

    if (file.type && signature.mime && file.type !== signature.mime) {
      warnings.push(`Declared MIME ${file.type} differs from detected ${signature.mime}.`);
    }

    if (type === 'image') {
      Object.assign(meta, await inspectImage(file, bytes, signature.format, warnings));
    } else if (type === 'video' || type === 'audio') {
      Object.assign(meta, await inspectMedia(file, type, warnings));
    } else if (type === 'pdf') {
      Object.assign(meta, inspectPdf(bytes, warnings));
    } else if (['json', 'html', 'csv', 'text'].includes(type)) {
      Object.assign(meta, inspectTextual(bytes, type, file.size, warnings));
    } else if (type === 'archive') {
      meta.archiveNotice = 'Archive signature detected. Deep archive and Office-property extraction requires an isolated backend parser.';
      warnings.push('Archive contents were not expanded in browser mode.');
    } else {
      meta.parserNotice = 'No specialized browser parser is available for this format.';
      warnings.push('Only file properties, signature, and SHA-256 were collected.');
    }

    meta.warnings = warnings;
    return { type, meta, warnings };
  }

  function detectSignature(bytes, file) {
    const starts = (...values) => values.every((value, index) => bytes[index] === value);
    const ascii = (start, length) => new TextDecoder('ascii').decode(bytes.slice(start, start + length));

    if (starts(0xff, 0xd8, 0xff)) return signature('image', 'JPEG', 'image/jpeg');
    if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return signature('image', 'PNG', 'image/png');
    if (ascii(0, 6) === 'GIF87a' || ascii(0, 6) === 'GIF89a') return signature('image', 'GIF', 'image/gif');
    if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') return signature('image', 'WebP', 'image/webp');
    if (ascii(0, 5) === '%PDF-') return signature('pdf', 'PDF', 'application/pdf');
    if (starts(0x50, 0x4b, 0x03, 0x04) || starts(0x50, 0x4b, 0x05, 0x06) || starts(0x50, 0x4b, 0x07, 0x08)) return signature('archive', 'ZIP or OOXML container', 'application/zip');
    if (ascii(4, 4) === 'ftyp') return signature(file.type.startsWith('audio/') ? 'audio' : 'video', 'ISO Base Media', file.type || 'video/mp4');
    if (ascii(0, 3) === 'ID3' || starts(0xff, 0xfb) || starts(0xff, 0xf3) || starts(0xff, 0xf2)) return signature('audio', 'MP3', 'audio/mpeg');
    if (ascii(0, 4) === 'OggS') return signature(file.type.startsWith('video/') ? 'video' : 'audio', 'Ogg', file.type || 'audio/ogg');
    if (ascii(0, 4) === 'fLaC') return signature('audio', 'FLAC', 'audio/flac');

    const inferred = inferTypeFromNameAndMime(file);
    return {
      type: inferred,
      format: file.type || extension(file.name) || 'unknown',
      mime: file.type || '',
      confidence: file.type ? 'declared by browser' : 'extension inference'
    };
  }

  function signature(type, format, mime) {
    return { type, format, mime, confidence: 'magic-byte signature' };
  }

  function inferTypeFromNameAndMime(file) {
    const mime = String(file.type || '').toLowerCase();
    const ext = extension(file.name);
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime === 'application/pdf' || ext === 'pdf') return 'pdf';
    if (mime === 'application/json' || ext === 'json') return 'json';
    if (mime === 'text/html' || ['html', 'htm'].includes(ext)) return 'html';
    if (mime === 'text/csv' || ext === 'csv') return 'csv';
    if (mime.startsWith('text/') || ['txt', 'md', 'yaml', 'yml', 'toml', 'log', 'xml'].includes(ext)) return 'text';
    if (['zip', 'docx', 'xlsx', 'pptx', 'odt', 'ods', 'epub'].includes(ext)) return 'archive';
    return 'other';
  }

  function extension(name) {
    const match = /\.([^.]+)$/.exec(String(name || ''));
    return match ? match[1].toLowerCase() : '';
  }

  async function sha256(buffer) {
    if (!crypto.subtle) return 'Unavailable outside a secure browser context';
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
  }

  async function inspectImage(file, bytes, format, warnings) {
    const output = { imageFormat: format };
    try {
      const bitmap = await createImageBitmap(file);
      output.width = bitmap.width;
      output.height = bitmap.height;
      output.pixelCount = bitmap.width * bitmap.height;
      bitmap.close?.();
    } catch {
      warnings.push('Browser image dimensions could not be decoded.');
    }

    if (format === 'JPEG') {
      try {
        Object.assign(output, parseJpegExif(bytes));
      } catch (error) {
        output.exifParserError = error instanceof Error ? error.message : String(error);
        warnings.push('JPEG EXIF parsing was incomplete.');
      }
    } else {
      output.metadataNotice = 'Browser mode currently parses EXIF only from JPEG APP1 segments. XMP, IPTC, ICC, HEIC, TIFF, PNG text chunks, and WebP metadata require the backend parser.';
      warnings.push('Deep image metadata was not parsed for this format.');
    }
    return output;
  }

  function parseJpegExif(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length < 4 || view.getUint16(0, false) !== 0xffd8) return { exifPresent: false };

    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      if (view.getUint8(offset) !== 0xff) break;
      const marker = view.getUint8(offset + 1);
      if (marker === 0xda || marker === 0xd9) break;
      const length = view.getUint16(offset + 2, false);
      if (length < 2 || offset + 2 + length > view.byteLength) break;

      if (marker === 0xe1 && length >= 8) {
        const header = new TextDecoder('ascii').decode(bytes.slice(offset + 4, offset + 10));
        if (header === 'Exif\0\0') return parseTiffExif(view, offset + 10, offset + 2 + length);
      }
      offset += 2 + length;
    }
    return { exifPresent: false };
  }

  function parseTiffExif(view, tiffStart, segmentEnd) {
    assertRange(tiffStart, 8, segmentEnd);
    const order = view.getUint16(tiffStart, false);
    const little = order === 0x4949;
    if (!little && order !== 0x4d4d) throw new Error('Invalid TIFF byte order');
    const u16 = (offset) => readU16(view, offset, little, segmentEnd);
    const u32 = (offset) => readU32(view, offset, little, segmentEnd);
    if (u16(tiffStart + 2) !== 42) throw new Error('Invalid TIFF marker');

    const firstIfd = tiffStart + u32(tiffStart + 4);
    const root = readIfd(view, tiffStart, firstIfd, little, segmentEnd);
    const result = { exifPresent: true };

    assignTag(result, 'cameraMake', root.get(0x010f));
    assignTag(result, 'cameraModel', root.get(0x0110));
    assignTag(result, 'orientation', root.get(0x0112));
    assignTag(result, 'imageDateTime', root.get(0x0132));

    const exifOffset = root.get(0x8769);
    if (typeof exifOffset === 'number') {
      const exif = readIfd(view, tiffStart, tiffStart + exifOffset, little, segmentEnd);
      assignTag(result, 'dateTimeOriginal', exif.get(0x9003));
      assignTag(result, 'digitizedTime', exif.get(0x9004));
      assignTag(result, 'lensMake', exif.get(0xa433));
      assignTag(result, 'lensModel', exif.get(0xa434));
      assignTag(result, 'exifWidth', exif.get(0xa002));
      assignTag(result, 'exifHeight', exif.get(0xa003));
    }

    const gpsOffset = root.get(0x8825);
    if (typeof gpsOffset === 'number') {
      const gps = readIfd(view, tiffStart, tiffStart + gpsOffset, little, segmentEnd);
      const latitude = gpsCoordinate(gps.get(0x0002), gps.get(0x0001));
      const longitude = gpsCoordinate(gps.get(0x0004), gps.get(0x0003));
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        result.gpsLatitude = latitude;
        result.gpsLongitude = longitude;
        result.gpsMapUrl = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(latitude)}&mlon=${encodeURIComponent(longitude)}#map=16/${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`;
      }
      const altitude = gps.get(0x0006);
      if (typeof altitude === 'number') result.gpsAltitudeMeters = altitude;
    }

    return result;
  }

  function assignTag(target, key, value) {
    if (value !== undefined && value !== null && value !== '') target[key] = value;
  }

  function readIfd(view, tiffStart, offset, little, end) {
    assertRange(offset, 2, end);
    const count = readU16(view, offset, little, end);
    if (count > 512) throw new Error('IFD entry limit exceeded');
    const tags = new Map();
    for (let index = 0; index < count; index += 1) {
      const entry = offset + 2 + index * 12;
      assertRange(entry, 12, end);
      const tag = readU16(view, entry, little, end);
      const type = readU16(view, entry + 2, little, end);
      const valueCount = readU32(view, entry + 4, little, end);
      const value = readTiffValue(view, tiffStart, entry, type, valueCount, little, end);
      tags.set(tag, value);
    }
    return tags;
  }

  function readTiffValue(view, tiffStart, entry, type, count, little, end) {
    const sizes = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
    const size = sizes[type];
    if (!size || count > 4096) return undefined;
    const total = size * count;
    const offset = total <= 4 ? entry + 8 : tiffStart + readU32(view, entry + 8, little, end);
    assertRange(offset, total, end);

    if (type === 2) {
      const chars = [];
      for (let i = 0; i < count; i += 1) {
        const code = view.getUint8(offset + i);
        if (!code) break;
        chars.push(code);
      }
      return new TextDecoder('ascii').decode(new Uint8Array(chars)).trim();
    }

    const values = [];
    for (let i = 0; i < count; i += 1) {
      const position = offset + i * size;
      if (type === 1 || type === 7) values.push(view.getUint8(position));
      else if (type === 3) values.push(readU16(view, position, little, end));
      else if (type === 4) values.push(readU32(view, position, little, end));
      else if (type === 9) values.push(view.getInt32(position, little));
      else if (type === 5 || type === 10) {
        const numerator = type === 5 ? readU32(view, position, little, end) : view.getInt32(position, little);
        const denominator = type === 5 ? readU32(view, position + 4, little, end) : view.getInt32(position + 4, little);
        values.push(denominator ? numerator / denominator : null);
      }
    }
    return count === 1 ? values[0] : values;
  }

  function gpsCoordinate(value, reference) {
    if (!Array.isArray(value) || value.length < 3) return null;
    const coordinate = Number(value[0]) + Number(value[1]) / 60 + Number(value[2]) / 3600;
    return ['S', 'W'].includes(String(reference || '').toUpperCase()) ? -coordinate : coordinate;
  }

  function readU16(view, offset, little, end) {
    assertRange(offset, 2, end);
    return view.getUint16(offset, little);
  }

  function readU32(view, offset, little, end) {
    assertRange(offset, 4, end);
    return view.getUint32(offset, little);
  }

  function assertRange(offset, length, end) {
    if (!Number.isInteger(offset) || !Number.isInteger(length) || offset < 0 || length < 0 || offset + length > end) {
      throw new Error('Metadata offset exceeded file bounds');
    }
  }

  async function inspectMedia(file, kind, warnings) {
    const output = { mediaKind: kind };
    const element = document.createElement(kind === 'video' ? 'video' : 'audio');
    const url = URL.createObjectURL(file);
    element.preload = 'metadata';
    element.src = url;

    try {
      await new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error('Media metadata timed out')), 10000);
        element.onloadedmetadata = () => {
          window.clearTimeout(timeout);
          resolve();
        };
        element.onerror = () => {
          window.clearTimeout(timeout);
          reject(new Error('Browser could not decode media metadata'));
        };
      });
      if (Number.isFinite(element.duration)) output.durationSeconds = element.duration;
      if (kind === 'video') {
        output.videoWidth = element.videoWidth;
        output.videoHeight = element.videoHeight;
      }
    } catch (error) {
      warnings.push(error.message);
    } finally {
      URL.revokeObjectURL(url);
    }
    output.metadataNotice = 'Container tags, codecs, GPS, creation times, and ID3 fields require the backend media parser.';
    warnings.push('Deep media-container metadata was not parsed.');
    return output;
  }

  function inspectPdf(bytes, warnings) {
    const head = decodeBytes(bytes.slice(0, Math.min(bytes.length, PDF_SCAN_BYTES)));
    const tail = decodeBytes(bytes.slice(Math.max(0, bytes.length - PDF_SCAN_BYTES)));
    const text = `${head}\n${tail}`;
    const output = {
      pdfVersion: /%PDF-([0-9.]+)/.exec(head)?.[1] || 'unknown',
      parserMode: 'quick uncompressed Info scan',
      parserCoverage: 'first and last 512 KB only'
    };

    ['Title', 'Author', 'Creator', 'Producer', 'CreationDate', 'ModDate', 'Subject', 'Keywords'].forEach((key) => {
      const value = extractPdfLiteral(text, key);
      if (value) output[`pdf${key}`] = value;
    });

    const pageMarkers = text.match(/\/Type\s*\/Page\b/g);
    if (pageMarkers) output.approximatePageMarkers = pageMarkers.length;
    warnings.push('Compressed PDF objects, XMP, UTF-16 strings, incremental revisions, attachments, and complete page counts require the backend parser.');
    return output;
  }

  function extractPdfLiteral(text, key) {
    const index = text.search(new RegExp(`/${key}\\s*\\(`));
    if (index < 0) return '';
    const start = text.indexOf('(', index);
    if (start < 0) return '';
    let output = '';
    let escaped = false;
    let depth = 1;
    for (let cursor = start + 1; cursor < text.length && output.length < 2048; cursor += 1) {
      const char = text[cursor];
      if (escaped) {
        output += char;
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '(') {
        depth += 1;
        output += char;
      } else if (char === ')') {
        depth -= 1;
        if (depth === 0) break;
        output += char;
      } else {
        output += char;
      }
    }
    return output.replace(/[\r\n\t]+/g, ' ').trim();
  }

  function inspectTextual(bytes, type, fileSize, warnings) {
    const sample = bytes.slice(0, Math.min(bytes.length, PREVIEW_BYTES));
    const text = decodeBytes(sample);
    const output = {
      preview: text.slice(0, 12000),
      previewBytes: sample.length,
      previewTruncated: fileSize > sample.length,
      sampledLineCount: text ? text.split(/\r?\n/).length : 0
    };

    if (type === 'json') {
      if (fileSize <= PREVIEW_BYTES) {
        try {
          const parsed = JSON.parse(text);
          output.jsonRootType = Array.isArray(parsed) ? 'array' : typeof parsed;
          output.jsonTopLevelEntries = Array.isArray(parsed) ? parsed.length : Object.keys(parsed || {}).length;
        } catch (error) {
          output.jsonError = error.message;
          warnings.push('JSON could not be parsed completely.');
        }
      } else {
        warnings.push('JSON was too large for complete browser parsing; only a bounded preview was decoded.');
      }
    }

    if (type === 'html') {
      const documentNode = new DOMParser().parseFromString(text, 'text/html');
      output.htmlTitle = documentNode.title || '';
      const metadata = {};
      [...documentNode.querySelectorAll('meta[name], meta[property]')].slice(0, 100).forEach((element) => {
        const key = element.getAttribute('name') || element.getAttribute('property');
        if (key) metadata[key] = element.getAttribute('content') || '';
      });
      output.htmlMetadata = metadata;
      if (fileSize > sample.length) warnings.push('HTML analysis used only the first 256 KB.');
    }

    if (type === 'csv') {
      const lines = text.split(/\r?\n/).filter((line) => line.length).slice(0, 5000);
      const delimiter = inferDelimiter(lines.slice(0, 20));
      output.csvDelimiter = delimiter === '\t' ? 'tab' : delimiter;
      output.csvSampledRows = lines.length;
      output.csvHeader = lines[0] ? splitDelimitedLine(lines[0], delimiter).slice(0, 100) : [];
      output.csvSampledColumns = output.csvHeader.length;
      if (fileSize > sample.length) warnings.push('CSV row and column counts are based on the first 256 KB.');
    }

    return output;
  }

  function inferDelimiter(lines) {
    const candidates = [',', '\t', ';', '|'];
    let best = ',';
    let bestScore = -1;
    candidates.forEach((candidate) => {
      const counts = lines.map((line) => splitDelimitedLine(line, candidate).length).filter((count) => count > 1);
      if (!counts.length) return;
      const common = mode(counts);
      const consistency = counts.filter((count) => count === common).length / counts.length;
      const score = common * consistency;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    });
    return best;
  }

  function splitDelimitedLine(line, delimiter) {
    const values = [];
    let current = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"') {
        if (quoted && line[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === delimiter && !quoted) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  }

  function mode(values) {
    const counts = new Map();
    values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 0;
  }

  function decodeBytes(bytes) {
    if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes);
    if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes);
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  }

  function renderList() {
    const container = $('#fileList');
    const filter = $('#typeFilter').value;
    const search = $('#fileSearch').value.trim().toLowerCase();
    const visible = state.items.filter((item) => {
      const typeMatch = filter === 'all' || item.type === filter;
      const searchMatch = !search || item.file.name.toLowerCase().includes(search)
        || JSON.stringify(item.meta).toLowerCase().includes(search);
      return typeMatch && searchMatch;
    });

    container.replaceChildren();
    $('#fileCount').textContent = `${visible.length} shown · ${state.items.length} total`;

    if (!visible.length) {
      container.appendChild(emptyState(state.items.length ? 'No files match the current filter.' : 'No files inspected in this session.'));
      return;
    }

    visible.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'metadata-file';
      button.setAttribute('aria-current', String(item.id === state.selectedId));
      button.addEventListener('click', () => {
        state.selectedId = item.id;
        renderList();
        renderDetail();
      });

      const name = document.createElement('span');
      name.className = 'metadata-file-name';
      name.textContent = item.file.name;

      const details = document.createElement('span');
      details.className = 'metadata-file-meta';
      details.append(chip(item.type), chip(formatBytes(item.file.size)));

      const status = document.createElement('span');
      status.className = `metadata-status ${statusTone(item.status)}`;
      status.textContent = statusLabel(item);

      button.append(name, details, status);
      container.appendChild(button);
    });
  }

  function renderDetail() {
    const container = $('#detailRows');
    const preview = $('#preview');
    const title = $('#detailTitle');
    const item = state.items.find((entry) => entry.id === state.selectedId);
    container.replaceChildren();
    preview.textContent = '';
    $('#copyHash').disabled = true;
    $('#removeSelected').disabled = !item;

    if (!item) {
      title.textContent = 'No file selected';
      container.appendChild(emptyState('Select an inspected file to review its metadata.'));
      preview.hidden = true;
      return;
    }

    title.textContent = item.file.name;
    if (item.status === 'processing') {
      container.appendChild(emptyState('Inspection is in progress.'));
      preview.hidden = true;
      return;
    }

    if (item.status === 'error') {
      appendDetailRow(container, 'Error', item.error || 'Unknown parser error');
      preview.hidden = true;
      return;
    }

    const entries = Object.entries(item.meta).filter(([key]) => key !== 'preview');
    entries.forEach(([key, value]) => appendDetailRow(container, humanize(key), displayValue(value)));
    preview.hidden = !item.meta.preview;
    if (item.meta.preview) preview.textContent = item.meta.preview;
    $('#copyHash').disabled = !item.meta.sha256;
  }

  function appendDetailRow(container, label, value) {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');

    if (label === 'GPS Map URL' && /^https:\/\//.test(value)) {
      const link = document.createElement('a');
      link.href = value;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open mapped coordinates';
      description.appendChild(link);
    } else {
      description.textContent = value;
    }
    container.append(term, description);
  }

  function displayValue(value) {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'object') {
      const text = JSON.stringify(value, null, 2);
      return text.length > 5000 ? `${text.slice(0, 5000)}\n…truncated in display` : text;
    }
    return String(value);
  }

  function humanize(key) {
    return key
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/^./, (char) => char.toUpperCase());
  }

  function chip(text) {
    const element = document.createElement('span');
    element.className = 'cmx-chip';
    element.textContent = text;
    return element;
  }

  function statusTone(status) {
    if (status === 'complete') return 'good';
    if (status === 'warning' || status === 'processing') return 'warn';
    return 'bad';
  }

  function statusLabel(item) {
    if (item.status === 'processing') return 'Inspecting locally';
    if (item.status === 'complete') return 'Inspection complete';
    if (item.status === 'warning') return `${item.warnings?.length || 1} parser limitation${item.warnings?.length === 1 ? '' : 's'}`;
    return 'Inspection failed';
  }

  function emptyState(message) {
    const element = document.createElement('div');
    element.className = 'cmx-empty';
    element.textContent = message;
    return element;
  }

  function setBusy(busy) {
    $('#pickFiles').disabled = busy;
    $('#fileInput').disabled = busy;
    $('#exportAll').disabled = busy || !state.items.some((item) => ['complete', 'warning'].includes(item.status));
    $('#clearAll').disabled = busy || !state.items.length;
  }

  function updateProgress(percent, label) {
    $('#progressBar').style.width = `${Math.max(0, Math.min(100, percent))}%`;
    $('#progressLabel').textContent = label;
  }

  function removeSelected() {
    if (!state.selectedId || state.processing) return;
    const index = state.items.findIndex((item) => item.id === state.selectedId);
    if (index < 0) return;
    state.items.splice(index, 1);
    state.selectedId = state.items[index]?.id || state.items[index - 1]?.id || null;
    renderList();
    renderDetail();
    setBusy(false);
    notify('Selected file removed from the browser session.');
  }

  function clearAll() {
    if (state.processing || !state.items.length) return;
    if (!window.confirm('Clear every inspected file and metadata result from this browser session?')) return;
    state.items = [];
    state.selectedId = null;
    renderList();
    renderDetail();
    setBusy(false);
    notify('Metadata session cleared.');
  }

  function copySelectedHash() {
    const item = state.items.find((entry) => entry.id === state.selectedId);
    if (!item?.meta.sha256) return;
    navigator.clipboard.writeText(item.meta.sha256)
      .then(() => notify('SHA-256 copied.'))
      .catch(() => notify('Clipboard access was blocked.'));
  }

  function exportAll() {
    const entries = state.items
      .filter((item) => ['complete', 'warning'].includes(item.status))
      .map((item) => ({
        id: item.id,
        type: item.type,
        status: item.status,
        warnings: item.warnings || [],
        metadata: item.meta
      }));
    if (!entries.length) return;

    const payload = {
      schema: 'cmx-metadata-session-v1',
      exportedAt: new Date().toISOString(),
      mode: 'local-browser',
      entries
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `cmx-metadata-session-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify('Metadata session exported.');
  }

  function formatBytes(value) {
    if (!Number.isFinite(value) || value < 0) return '—';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = value;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit += 1;
    }
    return `${size.toFixed(unit && size < 10 ? 1 : 0)} ${units[unit]}`;
  }

  let toastTimer;
  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }
})();
