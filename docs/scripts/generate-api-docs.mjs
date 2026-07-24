import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '../..');
const componentsDir = join(root, 'src/components');
const output = join(root, 'docs/.vitepress/generated/api.json');
const defaults = {
  UiAccordionProps: { modelValue: 'null', multiple: 'false', collapsible: 'true' },
  UiAvatarProps: { size: "'md'", shape: "'circle'" },
  UiDialogProps: { modelValue: 'false', size: "'md'", teleport: 'true', closeOnEscape: 'true', closeOnBackdrop: 'true', showClose: 'true' },
  UiDataTableProps: { sort: 'null', filters: '{}', page: '1', pageSize: '10', pagination: 'true', manualSorting: 'false', manualFiltering: 'false', manualPagination: 'false', loading: 'false', striped: 'false', hoverable: 'true', stickyHeader: 'false', dense: 'false', bordered: 'false', tableLayout: "'auto'", filterable: 'true', filterDialogTeleport: 'true', lazy: 'false', hasMore: 'true', loadingMore: 'false', lazyThreshold: '96' },
  UiDataTableFiltersProps: { modelValue: 'false', filters: '{}', teleport: 'true' },
  UiDividerProps: { orientation: "'horizontal'", labelPosition: "'center'" },
  UiDropdownMenuProps: { modelValue: 'false', placement: "'bottom'", disabled: 'false' },
  UiEmptyStateProps: { size: "'md'" },
  UiPaginationProps: { modelValue: '1', pageSize: '10', siblingCount: '1', disabled: 'false', size: "'md'" },
  UiPopoverProps: { modelValue: 'false', placement: "'bottom'", disabled: 'false', closeOnEscape: 'true', closeOnOutside: 'true' },
  UiSkeletonProps: { variant: "'text'", width: "'100%'", height: "'1rem'", lines: '1', animated: 'true' },
  UiTabsProps: { orientation: "'horizontal'", activation: "'automatic'" },
  UiToastProps: { modelValue: 'true', tone: "'neutral'", duration: '5000', dismissible: 'true' },
  UiTooltipProps: { placement: "'top'", delay: '300', disabled: 'false' },
};

const result = {};
for (const directory of await readdir(componentsDir, { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  const folder = join(componentsDir, directory.name);
  for (const file of await readdir(folder)) {
    if (!file.endsWith('.types.ts')) continue;
    const path = join(folder, file);
    const sourceText = await readFile(path, 'utf8');
    const source = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    for (const node of source.statements) {
      if (!ts.isInterfaceDeclaration(node) || !node.name.text.endsWith('Props')) continue;
      result[node.name.text] = node.members.filter(ts.isPropertySignature).map((property) => ({
        name: property.name.getText(source).replaceAll(/['"]/g, ''),
        type: property.type?.getText(source) ?? 'unknown',
        required: !property.questionToken,
        default: defaults[node.name.text]?.[property.name.getText(source).replaceAll(/['"]/g, '')] ?? '—',
      }));
    }
  }
}
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Generated API for ${Object.keys(result).length} prop interfaces.`);
