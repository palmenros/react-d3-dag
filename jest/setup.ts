import raf from './polyfills/raf';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// @ts-ignore
configure({ adapter: new Adapter() });
