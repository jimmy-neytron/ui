const demoFramePattern = /<DemoFrame(\s[^>]*)?>([\s\S]*?)<\/DemoFrame>/g;
const fencedCodePattern = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;

function dedent(source: string) {
  const lines = source.trim().split('\n');
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const indentation = indents.length > 0 ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(indentation)).join('\n');
}

function injectIntoSegment(markdown: string) {
  return markdown.replace(demoFramePattern, (match, attributes = '', content: string) => {
    if (/\scode=/.test(attributes)) {
      return match;
    }

    const encodedSource = encodeURIComponent(dedent(content));
    return `<DemoFrame${attributes} code="${encodedSource}">${content}</DemoFrame>`;
  });
}

export function injectDemoFrameSource(markdown: string) {
  const fencedBlocks: string[] = [];
  const maskedMarkdown = markdown.replace(fencedCodePattern, (block) => {
    const index = fencedBlocks.push(block) - 1;
    return `<!--demo-frame-fence-${index}-->`;
  });

  return injectIntoSegment(maskedMarkdown).replace(
    /<!--demo-frame-fence-(\d+)-->/g,
    (_placeholder, index: string) => fencedBlocks[Number(index)] ?? '',
  );
}
