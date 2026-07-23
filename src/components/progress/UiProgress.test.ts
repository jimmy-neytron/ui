import { mount } from '@vue/test-utils';
import UiProgress from './UiProgress.vue';

describe('UiProgress', () => {
  it('renders an accessible indeterminate state by default', () => {
    const wrapper = mount(UiProgress);
    const track = wrapper.get('[role="progressbar"]');
    expect(wrapper.attributes('data-indeterminate')).toBe('true');
    expect(track.attributes('aria-label')).toBe('Progress');
    expect(track.attributes('aria-valuemin')).toBe('0');
    expect(track.attributes('aria-valuemax')).toBe('100');
    expect(track.attributes('aria-valuenow')).toBeUndefined();
    expect(wrapper.get('.cui-progress__bar').attributes('style')).toBeUndefined();
  });

  it('renders a determinate percentage', () => {
    const wrapper = mount(UiProgress, { props: { value: 25, showValue: true } });
    const track = wrapper.get('[role="progressbar"]');
    expect(wrapper.attributes('data-indeterminate')).toBeUndefined();
    expect(track.attributes('aria-valuenow')).toBe('25');
    expect(track.attributes('aria-valuetext')).toBe('25%');
    expect(wrapper.get('.cui-progress__bar').attributes('style')).toContain('25%');
    expect(wrapper.get('.cui-progress__value').text()).toBe('25%');
  });

  it('maps a custom numeric range to a percentage', () => {
    const wrapper = mount(UiProgress, { props: { value: 15, min: 10, max: 30 } });
    expect(wrapper.get('.cui-progress__bar').attributes('style')).toContain('25%');
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('15');
  });

  it.each([
    [-10, '0', '0%'],
    [150, '100', '100%'],
  ] as const)('clamps value %s to the public range', (value, ariaValue, text) => {
    const wrapper = mount(UiProgress, { props: { value } });
    const track = wrapper.get('[role="progressbar"]');
    expect(track.attributes('aria-valuenow')).toBe(ariaValue);
    expect(track.attributes('aria-valuetext')).toBe(text);
  });

  it('normalizes invalid ranges and non-finite values', () => {
    const invalidRange = mount(UiProgress, { props: { value: 10, min: 10, max: 5 } });
    const notFinite = mount(UiProgress, { props: { value: Number.NaN, min: Number.NaN } });
    expect(invalidRange.get('[role="progressbar"]').attributes('aria-valuemax')).toBe('11');
    expect(invalidRange.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('10');
    expect(notFinite.attributes('data-indeterminate')).toBe('true');
    expect(notFinite.get('[role="progressbar"]').attributes('aria-valuemin')).toBe('0');
  });

  it('uses a custom formatter with normalized arguments', () => {
    const formatValue = vi.fn((value: number, min: number, max: number) =>
      `${value} of ${max - min}`,
    );
    const wrapper = mount(UiProgress, {
      props: { value: 150, min: 0, max: 100, showValue: true, formatValue },
    });
    expect(formatValue).toHaveBeenCalledWith(100, 0, 100);
    expect(wrapper.get('.cui-progress__value').text()).toBe('100 of 100');
  });

  it('renders label prop or label slot without redundant aria-label', () => {
    const fromProp = mount(UiProgress, { props: { label: 'Upload' } });
    const fromSlot = mount(UiProgress, {
      props: { label: 'Ignored' },
      slots: { label: 'Deployment' },
    });
    expect(fromProp.get('.cui-progress__label').text()).toBe('Upload');
    expect(fromProp.get('[role="progressbar"]').attributes('aria-label')).toBeUndefined();
    expect(fromSlot.get('.cui-progress__label').text()).toBe('Deployment');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders %s size', (size) => {
    expect(mount(UiProgress, { props: { size } }).attributes('data-size')).toBe(size);
  });

  it.each(['primary', 'success', 'warning', 'danger'] as const)('renders %s tone', (tone) => {
    expect(mount(UiProgress, { props: { tone } }).attributes('data-tone')).toBe(tone);
  });

  it('forwards native attributes and merges classes', () => {
    const wrapper = mount(UiProgress, {
      attrs: { id: 'upload-progress', class: 'custom-progress', 'data-testid': 'progress' },
    });
    expect(wrapper.attributes('id')).toBe('upload-progress');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['cui-progress', 'custom-progress']));
    expect(wrapper.attributes('data-testid')).toBe('progress');
  });
});
