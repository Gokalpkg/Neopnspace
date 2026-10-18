// Node.js ESM customization loader hook for tests
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (url.includes('/src/game.js') && result.source) {
    const raw = typeof result.source === 'string'
      ? result.source
      : Buffer.from(result.source).toString('utf8');
    const transformed = raw
      .replace(/import\.meta\.env\.PROD/g, 'false')
      .replace(/import\.meta\.env\.DEV/g, 'true')
      .replace(/import\.meta\.env/g, '({ PROD: false, DEV: true, MODE: "test" })');
    return {
      ...result,
      source: transformed
    };
  }
  return result;
}
