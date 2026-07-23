import { mount } from '@vue/test-utils';
import UiAvatar from './UiAvatar.vue';
describe('UiAvatar', () => {
  it('renders image and all visual props', () => { const w=mount(UiAvatar,{props:{src:'/a.png',alt:'Ada',name:'Ada Lovelace',size:'lg',shape:'rounded',status:'online'}}); expect(w.get('img').attributes('alt')).toBe('Ada'); expect(w.attributes('data-size')).toBe('lg'); expect(w.attributes('data-shape')).toBe('rounded'); expect(w.get('.cui-avatar__status').attributes('data-status')).toBe('online'); });
  it('renders initials and slots', () => { const w=mount(UiAvatar,{props:{name:'ada lovelace',status:'online'},slots:{status:'!'}}); expect(w.get('.cui-avatar__fallback').text()).toBe('AL'); expect(w.get('.cui-avatar__status').text()).toBe('!'); });
  it('falls back after image error and resets for a new source', async()=>{const w=mount(UiAvatar,{props:{src:'/bad',name:'Grace Hopper'}});await w.get('img').trigger('error');expect(w.text()).toContain('GH');await w.setProps({src:'/good'});expect(w.find('img').exists()).toBe(true);});
  it('supports fallback slot and native attrs',()=>{const w=mount(UiAvatar,{attrs:{title:'User'},slots:{default:'X'}});expect(w.text()).toContain('X');expect(w.attributes('title')).toBe('User');});
});
