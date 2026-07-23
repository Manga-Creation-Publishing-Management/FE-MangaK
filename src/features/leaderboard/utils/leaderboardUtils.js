export const formatDateLabel = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    const trimmed = dateVal.trim();
    if (trimmed.includes('T')) return trimmed.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  }
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
  }
  return String(dateVal).trim();
};

export const getPeriodOptionDetails = (item, index) => {
  if (!item) return { value: '', label: '' };

  if (typeof item === 'object' && item !== null) {
    const startRaw = item.startDate ?? item.start ?? item.from ?? item.startTime;
    const endRaw = item.endDate ?? item.end ?? item.to ?? item.endTime;

    if (startRaw && endRaw) {
      const periodStr = `${formatDateLabel(startRaw)} - ${formatDateLabel(endRaw)}`;
      const label = item.periodName ?? item.name ?? item.title ?? item.label ?? periodStr;
      return { value: periodStr, label: label };
    }

    const strVal = item.period ?? item.value ?? item.periodId ?? item.id ?? item.name ?? item.code;
    if (typeof strVal === 'string' && strVal.includes(' - ')) {
      const parts = strVal.split(' - ');
      const periodStr = `${formatDateLabel(parts[0])} - ${formatDateLabel(parts[1])}`;
      return { value: periodStr, label: item.periodName ?? item.name ?? item.label ?? periodStr };
    }

    const formatted = formatDateLabel(strVal);
    return { value: formatted, label: String(item.periodName ?? item.name ?? formatted) };
  }

  if (typeof item === 'string') {
    if (item.includes(' - ')) {
      const parts = item.split(' - ');
      const periodStr = `${formatDateLabel(parts[0])} - ${formatDateLabel(parts[1])}`;
      return { value: periodStr, label: periodStr };
    }
    const formatted = formatDateLabel(item);
    return { value: formatted, label: formatted };
  }

  return { value: String(item), label: String(item) };
};

export const isTrendingUp = (change) => {
  if (!change) return true;
  return !String(change).trim().startsWith('-');
};
