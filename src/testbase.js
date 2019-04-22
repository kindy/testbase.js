import yaml from 'js-yaml';
import {expect} from 'chai';

export function loadDefs(src) {
  return yaml.safeLoad(src.replace(/^[\s\n]+|[\s\n]$/g, ''));
}

export function generateCases(blocks, {runCase, prefix, caseTitle, env, it: itFn = it}) {
  blocks.forEach((block, idx) => {
    if (prefix) {
      block = prefix(block);
    }

    const title = caseTitle && caseTitle(block) || block.title || `case [${idx}]`;
    const runCaseWrapper = function(...args) {
      return runCase.call(this, {block, env, expect}, ...args);
    };

    if (block.only) {
      itFn.only(title, runCaseWrapper);
    } else if (block.skip) {
      itFn.skip(title, runCaseWrapper);
    } else {
      itFn(title, runCaseWrapper);
    }
  });

}

export function loadCases(src, opt) {
  const defs = loadDefs(src);
  const {blocks} = defs;

  generateCases(blocks, opt);

  return defs;
}
