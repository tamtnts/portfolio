const NAMED_CHARACTER_REFERENCES = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  quot: '"',
};

function decodeHtmlCharacterReferences(value) {
  return value.replace(/&(?:(#x[0-9a-f]+)|(#\d+)|(amp|apos|gt|lt|quot));/gi, (reference, hexadecimal, decimal, named) => {
    if (named) return NAMED_CHARACTER_REFERENCES[named.toLowerCase()];

    const codePoint = Number.parseInt(
      hexadecimal ? hexadecimal.slice(2) : decimal.slice(1),
      hexadecimal ? 16 : 10,
    );
    if (codePoint < 0 || codePoint > 0x10ffff) return reference;
    return String.fromCodePoint(codePoint);
  });
}

function tagsWithAttribute(html, tagName, attribute, expectedValue) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || [];
  return tags.filter((tag) => {
    const attributeMatch = new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(tag);
    return attributeMatch?.[2] === expectedValue;
  });
}

function getAttribute(tag, attribute) {
  const value = new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(tag)?.[2];
  return value ? decodeHtmlCharacterReferences(value) : null;
}

function requireExactlyOne(tags, description, route) {
  if (tags.length !== 1) {
    throw new Error(`${route} must emit exactly one ${description}; found ${tags.length}.`);
  }
  return tags[0];
}

export function validatePrerenderedHtml(html, expectedMetadata, configuredBasePath) {
  const { route, title: expectedTitle, canonical: expectedCanonical, ogImage: expectedOgImage } = expectedMetadata;
  const titleTags = html.match(/<title\b[^>]*>[\s\S]*?<\/title>/gi) || [];
  const title = decodeHtmlCharacterReferences(
    requireExactlyOne(titleTags, 'title', route).replace(/<[^>]+>/g, ''),
  );
  if (title !== expectedTitle) {
    throw new Error(`${route} title must equal "${expectedTitle}"; found "${title}".`);
  }

  const canonical = requireExactlyOne(
    tagsWithAttribute(html, 'link', 'rel', 'canonical'),
    'canonical link',
    route,
  );
  if (getAttribute(canonical, 'href') !== expectedCanonical) {
    throw new Error(`${route} canonical must equal "${expectedCanonical}".`);
  }

  requireExactlyOne(tagsWithAttribute(html, 'meta', 'name', 'description'), 'description', route);
  const ogTitle = requireExactlyOne(tagsWithAttribute(html, 'meta', 'property', 'og:title'), 'og:title', route);
  const ogUrl = requireExactlyOne(tagsWithAttribute(html, 'meta', 'property', 'og:url'), 'og:url', route);
  const ogImage = requireExactlyOne(tagsWithAttribute(html, 'meta', 'property', 'og:image'), 'og:image', route);
  if (getAttribute(ogTitle, 'content') !== expectedTitle) {
    throw new Error(`${route} og:title must equal "${expectedTitle}".`);
  }
  if (getAttribute(ogUrl, 'content') !== expectedCanonical) {
    throw new Error(`${route} og:url must equal its canonical URL.`);
  }
  if (getAttribute(ogImage, 'content') !== expectedOgImage) {
    throw new Error(`${route} og:image must equal "${expectedOgImage}".`);
  }

  for (const [attribute, key] of [
    ['property', 'og:description'],
    ['property', 'og:type'],
    ['name', 'twitter:card'],
    ['name', 'twitter:title'],
    ['name', 'twitter:description'],
  ]) {
    const tags = tagsWithAttribute(html, 'meta', attribute, key);
    if (tags.length > 1) {
      throw new Error(`${route} must emit at most one ${key}; found ${tags.length}.`);
    }
  }

  const jsonLdTags = tagsWithAttribute(html, 'script', 'type', 'application/ld+json');
  if (jsonLdTags.length > 1) {
    throw new Error(`${route} must emit at most one JSON-LD script; found ${jsonLdTags.length}.`);
  }

  for (const tag of html.match(/<(?:a|link|script|img)\b[^>]*>/gi) || []) {
    for (const attribute of ['href', 'src']) {
      const value = getAttribute(tag, attribute);
      if (value?.startsWith('/') && configuredBasePath !== '/' && !value.startsWith(configuredBasePath)) {
        throw new Error(`${route} emitted a root-relative ${attribute}: ${value}`);
      }
    }
  }
}
