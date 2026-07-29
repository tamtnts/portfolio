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

function tagsWithNamedAttribute(html, attribute) {
  const tags = html.match(/<[a-z][a-z0-9:-]*\b[^>]*>/gi) || [];
  return tags.filter((tag) => new RegExp(`\\b${attribute}\\s*=`, 'i').test(tag));
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
  const {
    route,
    title: expectedTitle,
    canonical: expectedCanonical,
    ogImage: expectedOgImage,
    c4Levels: expectedC4Levels,
  } = expectedMetadata;
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

  const diagramTags = tagsWithNamedAttribute(html, 'data-diagram-status');
  const diagramStatuses = diagramTags.map((tag) => getAttribute(tag, 'data-diagram-status'));
  const readyDiagramCount = diagramStatuses.filter((status) => status === 'ready').length;
  if (
    diagramTags.length !== expectedC4Levels.length ||
    readyDiagramCount !== expectedC4Levels.length
  ) {
    const statusSummary = diagramStatuses.length > 0 ? diagramStatuses.join(', ') : 'none';
    throw new Error(
      `${route} must emit exactly ${expectedC4Levels.length} ready diagrams; ` +
      `found ${readyDiagramCount} ready diagrams across ${diagramTags.length} status markers (${statusSummary}).`,
    );
  }

  const c4LevelTags = tagsWithNamedAttribute(html, 'data-c4-level');
  for (const expectedLevel of expectedC4Levels) {
    const count = c4LevelTags.filter(
      (tag) => getAttribute(tag, 'data-c4-level') === expectedLevel,
    ).length;
    if (count !== 1) {
      throw new Error(`${route} must emit exactly one C4 level ${expectedLevel} marker; found ${count}.`);
    }
  }
  if (c4LevelTags.length !== expectedC4Levels.length) {
    throw new Error(
      `${route} must emit exactly ${expectedC4Levels.length} C4 level markers; found ${c4LevelTags.length}.`,
    );
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
