import { isAbsolute, posix, relative, resolve, sep, win32 } from 'node:path';
import { realpathSync } from 'node:fs';

export function normalizeBasePath(value) {
  const trimmed = String(value ?? '').trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export function toPrerenderUrl(route, basePath) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedRoute = route === '/' ? '' : route.replace(/^\/+/, '');
  return normalizedBasePath === '/'
    ? `/${normalizedRoute}`
    : `${normalizedBasePath}${normalizedRoute}`;
}

export function resolveStaticFilePath(distDir, requestPathname, basePath) {
  let pathname;
  try {
    pathname = decodeURIComponent(requestPathname);
  } catch {
    return null;
  }

  const normalizedBasePath = normalizeBasePath(basePath);
  const relativeUrlPath = normalizedBasePath === '/'
    ? pathname.replace(/^\/+/, '')
    : pathname.startsWith(normalizedBasePath)
      ? pathname.slice(normalizedBasePath.length)
      : null;

  if (
    !relativeUrlPath ||
    relativeUrlPath.includes('\\') ||
    relativeUrlPath.split('/').includes('..')
  ) {
    return null;
  }

  const normalizedRelativePath = posix.normalize(relativeUrlPath);
  if (
    normalizedRelativePath === '.' ||
    normalizedRelativePath === '..' ||
    normalizedRelativePath.startsWith('../') ||
    normalizedRelativePath.startsWith('/') ||
    normalizedRelativePath.includes(':') ||
    isAbsolute(normalizedRelativePath) ||
    win32.isAbsolute(normalizedRelativePath)
  ) {
    return null;
  }

  const candidate = resolve(distDir, ...normalizedRelativePath.split('/'));
  const relativeCandidate = relative(distDir, candidate);
  if (
    !relativeCandidate ||
    relativeCandidate === '..' ||
    relativeCandidate.startsWith(`..${sep}`) ||
    isAbsolute(relativeCandidate)
  ) {
    return null;
  }

  try {
    const realDistDir = realpathSync(distDir);
    const realCandidate = realpathSync(candidate);
    const realRelativeCandidate = relative(realDistDir, realCandidate);
    if (
      !realRelativeCandidate ||
      realRelativeCandidate === '..' ||
      realRelativeCandidate.startsWith(`..${sep}`) ||
      isAbsolute(realRelativeCandidate)
    ) {
      return null;
    }
    return realCandidate;
  } catch {
    return null;
  }
}
